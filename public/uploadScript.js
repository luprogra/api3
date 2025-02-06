document.getElementById('uploadBtn').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const folderNameInput = "prueba"; // Elemento para obtener el nombre de la carpeta
    const formData = new FormData();

    // Verificar que se haya seleccionado un archivo y que el nombre de la carpeta no esté vacío
    if (fileInput.files.length > 0 ) {
        formData.append('file', fileInput.files[0]);
        formData.append('folderName', folderNameInput); // Añadir el nombre de la carpeta

        // Enviar el archivo y el nombre de la carpeta a la API
        fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.fileUrl) {
                alert('Archivo subido correctamente: ' + data.fileUrl);
                // Mostrar la imagen subida en el frontend
                const uploadedImage = document.getElementById('uploadedImage');
                uploadedImage.src = data.fileUrl;
            } else {
                alert('Error al subir el archivo');
            }
        })
        .catch(error => {
            console.error('Error al conectar con la API:', error);
            alert('Error al conectar con la API');
        });
    } else {
        alert('Por favor, selecciona un archivo y proporciona el nombre de la carpeta.');
    }
});


document.getElementById('getPhotoIdsBtn').addEventListener('click', function() {
    // Realizar la solicitud GET para obtener los IDs de las fotos en la carpeta 'subida'
    const folderName = 'prueba'
    fetch(`http://localhost:3000/get-photo-ids/${folderName}`)
        .then(response => response.json())
        .then(data => {
            if (data.photoIds) {
                alert('IDs de fotos obtenidos correctamente');
                // Mostrar las imágenes en una galería
                const gallery = document.getElementById('gallery');
                gallery.innerHTML = ''; // Limpiar la galería antes de agregar nuevas imágenes

                data.photoIds.forEach(photoId => {
                    // Construir la URL completa de la imagen
                    const imageUrl = `https://storage.googleapis.com/apistorage-80bab.firebasestorage.app/${photoId}`;
                    console.log(imageUrl)
                    // Crear un elemento de imagen
                    const imgElement = document.createElement('img');
                    imgElement.src = imageUrl;
                    imgElement.alt = photoId; // Puedes poner un nombre alternativo o ID como alt
                    imgElement.classList.add('gallery-item'); // Agregar una clase para estilos

                    // Crear un contenedor de imagen (opcional)
                    const imgContainer = document.createElement('div');
                    imgContainer.classList.add('gallery-item-container'); // Puedes personalizar esto

                    imgContainer.appendChild(imgElement);
                    gallery.appendChild(imgContainer);
                });
            } else {
                alert('No se encontraron fotos en la carpeta.');
            }
        })
        .catch(error => {
            console.error('Error al conectar con la API:', error);
            alert('Error al conectar con la API');
        });
});


