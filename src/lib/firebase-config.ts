import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwt7rELoo9C1hyi6xtYiUT7BIOMgWIiJA",
  authDomain: "tyretrace-ia.firebaseapp.com",
  projectId: "tyretrace-ia",
  storageBucket: "tyretrace-ia.appspot.com",
  messagingSenderId: "482093220627",
  appId: "1:482093220627:web:a9a27c0ab2a6dc951750e6"
};

// This is a common pattern to avoid re-initializing the app on every render.
export const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
