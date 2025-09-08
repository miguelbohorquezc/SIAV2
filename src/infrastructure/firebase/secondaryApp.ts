// App secundaria para crear usuarios sin tocar la sesión actual.
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

let secondaryApp: FirebaseApp | null = null;

export function getSecondaryApp(): FirebaseApp {
  if (secondaryApp) return secondaryApp;
  secondaryApp = initializeApp(
    {
      apiKey: import.meta.env.VITE_APIKEY,
      authDomain: import.meta.env.VITE_AUTHDOMAIN,
      projectId: import.meta.env.VITE_PROJECTID,
      storageBucket: import.meta.env.VITE_STORAGEBUCKET,
      messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
      appId: import.meta.env.VITE_APPID,
    },
    'secondary',
  );
  return secondaryApp;
}

export function getSecondaryAuth() {
  return getAuth(getSecondaryApp());
}
