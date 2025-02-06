const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('../config/firebase-admin-sdk.json');

// Inicializar Firebase Admin
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    storageBucket: 'apistorage-80bab.firebasestorage.app', // Nombre de tu bucket de Firebase
});

const storage = firebaseAdmin.storage();
const bucket = storage.bucket();

module.exports = { bucket };
