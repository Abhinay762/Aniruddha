// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7JUekqHLpAbkrSXSADkLt1kI_bzsZTd0",
  authDomain: "project-tracker-9c56f.firebaseapp.com",
  projectId: "project-tracker-9c56f",
  storageBucket: "project-tracker-9c56f.firebasestorage.app",
  messagingSenderId: "837888566755",
  appId: "1:837888566755:web:2a90f05eaaec0fff8aacd6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export default app
