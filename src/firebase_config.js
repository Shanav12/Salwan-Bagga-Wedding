import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUU5rwQEaRf2E-lll3DzUqdzCAduaQ0AI",
  authDomain: "salwan-bagga-wedding-6b25f.firebaseapp.com",
  projectId: "salwan-bagga-wedding-6b25f",
  storageBucket: "salwan-bagga-wedding-6b25f.firebasestorage.app",
  messagingSenderId: "227249034078",
  appId: "1:227249034078:web:f896fb3b21e304a4b2b5cf",
  measurementId: "G-KLZKHFMQ1W",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
// Second bucket for wedding week photos — create this bucket in Firebase Console
// and replace the placeholder with the actual gs:// URL
export const weddingPhotosStorage = getStorage(app, "gs://salwan-bagga-wedding-2b25f");
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});