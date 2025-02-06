const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { bucket } = require('./firebase'); // Importar Firebase

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'subida/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const app = express();

app.use(cors());
app.use('/uploads', express.static('subida'));
app.post('/upload', upload.single('file'), async (req, res) => {
    // Verificar que se haya subido un archivo
    if (!req.file) {
        return res.status(400).send('No se ha subido ningún archivo.');
    }

    // Obtener el nombre de la carpeta desde el cuerpo de la solicitud
    const folderName = req.body.folderName; // nombre de la carpeta

    if (!folderName) {
        return res.status(400).send('No se ha especificado el nombre de la carpeta.');
    }

    // Definir la ruta en Firebase Storage
    const filePath = req.file.path;
    const destination = `${folderName}/${req.file.filename}`; // Usar la carpeta proporcionada

    try {
        // Subir el archivo al bucket de Firebase
        await bucket.upload(filePath, {
            destination: destination,
            public: true,
            metadata: {
                contentType: req.file.mimetype
            }
        });

        // Generar la URL pública del archivo subido
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
        console.log(publicUrl);

        // Responder con la URL pública del archivo
        res.status(200).json({
            message: 'Archivo subido correctamente a Firebase',
            fileUrl: publicUrl
        });
    } catch (error) {
        console.error('Error al subir el archivo a Firebase:', error);
        res.status(500).send('Error al subir el archivo a Firebase.');
    }
});


app.get('/get-photo-ids/:folderName', async (req, res) => {
    const { folderName } = req.params; // Obtiene el nombre de la carpeta desde la URL

    try {
        // Obtiene todos los archivos en la carpeta
        const [files] = await bucket.getFiles({ prefix: folderName + '/' });

        // Si no hay archivos, respondemos con un mensaje adecuado
        if (files.length === 0) {
            return res.status(404).json({ message: 'No se encontraron archivos en esta carpeta.' });
        }

        // Extraemos los nombres de los archivos (IDs)
        const photoIds = files.map(file => file.name); // Los "name" son los nombres de los archivos
        
        res.status(200).json({
            message: 'Archivos encontrados',
            photoIds: photoIds
        });
    } catch (error) {
        console.error('Error al obtener las fotos de la carpeta:', error);
        res.status(500).json({ message: 'Error al obtener los IDs de las fotos' });
    }
});


app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
