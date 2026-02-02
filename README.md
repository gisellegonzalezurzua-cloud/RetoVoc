# RetoVoc

App móvil para ampliar vocabulario dirigido a estudiantes chilenos de **7° básico** a **2° medio**.

## Objetivo
Aplicación educativa en español, pensada para ser entretenida y visualmente atractiva. Incluye autenticación para estudiantes y docentes, flashcards, quizzes y administración de vocabulario por parte de docentes.

## Tecnologías (recomendadas)
- Frontend móvil: **React Native (Expo)**
- Backend / Auth / DB: **Firebase (Auth + Firestore + Storage)**

## Estructura inicial del repo
- `App.js` - punto de entrada con navegación
- `src/db/firebase.js` - plantilla de inicialización de Firebase
- `src/screens` - pantallas: login, inicio, administración
- `src/components` - componentes reutilizables (flashcards)
- `src/data` - contenido de palabras por nivel (JSON)

## Setup rápido
1. Instala dependencias: `npm install`.
2. Copia la configuración de Firebase en `src/db/firebase.js`.
### Reglas y seeding (Firestore)

- Añade las reglas de seguridad en Firebase Console > Firestore > Rules usando el archivo `firestore.rules` incluido.

### Importar palabras y crear usuarios de prueba

- Para importar las palabras iniciales a Firestore (requiere credenciales de servicio):
  1. Descarga un `serviceAccountKey.json` desde Firebase Console (Project Settings > Service accounts).
  2. Coloca el archivo en la raíz del repositorio con nombre `serviceAccountKey.json`.
  3. Ejecuta: `npm run seed` (esto subirá las palabras de `src/data` a la colección `words`).

- Para crear usuarios de prueba (docentes y estudiantes) en Firebase Auth y asignarles rol:
  1. Asegúrate de tener `serviceAccountKey.json` en la raíz (igual que para el seeding) o añade el contenido del `serviceAccountKey.json` como secret en GitHub: `FIREBASE_SERVICE_ACCOUNT`.
  2. Ejecuta localmente: `npm run seed-users` — esto creará cuatro cuentas de ejemplo y guardará su rol en `users/{uid}` en Firestore.

  - Cuentas generadas por defecto:
    - Docentes: `docente1@retovoc.test` / `Profesor123`, `docente2@retovoc.test` / `Profesor123`
    - Estudiantes: `estudiante1@retovoc.test` / `Alumno123`, `estudiante2@retovoc.test` / `Alumno123`

  3. También puedes automatizar (recomendado): añade un secret llamado `FIREBASE_SERVICE_ACCOUNT` con el contenido JSON del `serviceAccountKey.json` en GitHub (Settings → Secrets → Actions). Luego en la pestaña 'Actions' ejecuta manualmente el workflow `Firebase rules deploy & seeding` para desplegar `firestore.rules` y ejecutar ambos scripts sin subir credenciales al repositorio.

  4. Puedes cambiar las credenciales en `scripts/seedUsers.js` antes de ejecutar si lo deseas.
3. Ejecuta: `npm start` y abre con Expo Go en tu dispositivo móvil o emulador.

---

Si quieres, puedo:
- Conectar reglas de Firestore y dar de alta usuarios de prueba.
- Añadir CI y scripts para build/producción.
- Importar listas de palabras adicionales desde fuentes públicas.

Dime cuál prefieres como siguiente paso. 🚀
