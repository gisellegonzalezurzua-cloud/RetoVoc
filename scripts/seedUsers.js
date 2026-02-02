// Script para crear usuarios de prueba (docentes y estudiantes) en Firebase Auth
// Requisitos:
// 1) Descarga `serviceAccountKey.json` desde Firebase Console (Project Settings > Service accounts)
// 2) Coloca `serviceAccountKey.json` en la raíz del repositorio
// 3) Ejecuta: `npm run seed-users`

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
const auth = admin.auth();
const db = admin.firestore();

const users = [
  { email: 'docente1@retovoc.test', password: 'Profesor123', role: 'teacher' },
  { email: 'docente2@retovoc.test', password: 'Profesor123', role: 'teacher' },
  { email: 'estudiante1@retovoc.test', password: 'Alumno123', role: 'student' },
  { email: 'estudiante2@retovoc.test', password: 'Alumno123', role: 'student' }
];

(async () => {
  try {
    for (const u of users) {
      // Si el usuario ya existe, lo omitimos
      let userRecord = null;
      try { userRecord = await auth.getUserByEmail(u.email); } catch (e) { /* no existe */ }

      if (!userRecord) {
        userRecord = await auth.createUser({ email: u.email, password: u.password });
        console.log('Usuario creado:', u.email);
      } else {
        console.log('Usuario ya existe, actualizando rol:', u.email);
      }

      // Guardar rol en Firestore
      await db.collection('users').doc(userRecord.uid).set({ email: u.email, role: u.role }, { merge: true });
    }

    console.log('\nUsuarios de prueba creados/actualizados con éxito.');
    console.log('Docentes: docente1@retovoc.test / Profesor123, docente2@retovoc.test / Profesor123');
    console.log('Estudiantes: estudiante1@retovoc.test / Alumno123, estudiante2@retovoc.test / Alumno123');
    process.exit(0);
  } catch (err) {
    console.error('Error creando usuarios:', err);
    process.exit(1);
  }
})();
