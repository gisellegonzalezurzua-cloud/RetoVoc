// Script para importar las palabras existentes a Firestore usando Firebase Admin SDK
// Uso:
// 1) Descarga un serviceAccountKey.json desde Firebase Console (Project Settings > Service accounts)
// 2) Coloca el archivo en la raíz del repositorio con nombre `serviceAccountKey.json`
// 3) Ejecuta: `node scripts/seedFirestore.js`

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('No se encontró serviceAccountKey.json en la raíz del repo. Descárgalo desde Firebase Console y colócalo en la raíz.');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function seedFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  for (const w of data) {
    const docRef = db.collection('words').doc(w.id);
    await docRef.set(w);
    console.log('Seeded', w.id);
  }
}

(async () => {
  try {
    await seedFile(path.join(__dirname, '..', 'src', 'data', 'words_7_basico.json'));
    await seedFile(path.join(__dirname, '..', 'src', 'data', 'words_2_medio.json'));
    console.log('Seeding completado.');
    process.exit(0);
  } catch (err) {
    console.error('Error seed:', err);
    process.exit(1);
  }
})();
