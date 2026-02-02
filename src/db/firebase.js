// Plantilla de inicialización de Firebase (añade tus credenciales aquí)
// Crea un proyecto en https://console.firebase.google.com/ y copia la config.

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Crea o actualiza el perfil del usuario en Firestore.
 * @param {string} uid
 * @param {object} data
 */
export async function createUserProfile(uid, data) {
  return setDoc(doc(db, 'users', uid), data);
}

// NOTE: For production, store config in env vars and don't commit secrets to repo.
