import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const required = (value: string | undefined, name: string) => {
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
};

const firebaseConfig = {
  apiKey: required(import.meta.env.VITE_APIKEY, "VITE_APIKEY"),
  authDomain: required(import.meta.env.VITE_AUTHDOMAIN, "VITE_AUTHDOMAIN"),
  projectId: required(import.meta.env.VITE_PROJECTID, "VITE_PROJECTID"),
  storageBucket: required(import.meta.env.VITE_STORAGEBUCKET, "VITE_STORAGEBUCKET"),
  messagingSenderId: required(import.meta.env.VITE_MESSAGINGSENDERID, "VITE_MESSAGINGSENDERID"),
  appId: required(import.meta.env.VITE_APPID, "VITE_APPID"),
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
