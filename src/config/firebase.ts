// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAg6fOxzexbUPYq9VTOYOHglPazD1qXkI",
  authDomain: "klean-ba62e.firebaseapp.com",
  projectId: "klean-ba62e",
  storageBucket: "klean-ba62e.firebasestorage.app",
  messagingSenderId: "1016441327526",
  appId: "1:1016441327526:web:caabc576f9b944101b8967",
  measurementId: "G-C8HT19522E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);