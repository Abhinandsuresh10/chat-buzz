// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpEqQeeipDRUg2cPmjJR2z-L1opcab4I0",
  authDomain: "chat-buzz-c5495.firebaseapp.com",
  projectId: "chat-buzz-c5495",
  storageBucket: "chat-buzz-c5495.firebasestorage.app",
  messagingSenderId: "864709761385",
  appId: "1:864709761385:web:013ddc5e0a9affd816c5f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);