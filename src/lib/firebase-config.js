// firebase-config.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "ton-projet.firebaseapp.com",
  projectId: "studio-8267356228",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "XXXX",
  appId: "1:XXXX:web:XXXX"
};

// L'initialisation avec des identifiants invalides peut bloquer le serveur.
// const app = initializeApp(firebaseConfig);
const app = null; // Désactivé temporairement
export default app;
