// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAiL6exy-z9fz_9jNvVTGnpq1JcbyMd3jA",
  authDomain: "nomnom-notes.firebaseapp.com",
  projectId: "nomnom-notes",
  storageBucket: "nomnom-notes.firebasestorage.app",
  messagingSenderId: "309591633361",
  appId: "1:309591633361:web:a960927854f96d441144f0",
  measurementId: "G-E2P4X3J02H"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();