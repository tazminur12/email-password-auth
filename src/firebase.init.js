// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Firestore added ✅

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1P3X2pZbq69QmQm0aOlKRv_-a0czI050",
  authDomain: "email-password-auth-448c5.firebaseapp.com",
  projectId: "email-password-auth-448c5",
  storageBucket: "email-password-auth-448c5.appspot.com", // (small fix here too ✅)
  messagingSenderId: "340313114674",
  appId: "1:340313114674:web:412d51af50f184da7ed42b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore added ✅
