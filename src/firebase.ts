import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {getFirestore} from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyDrQZHjiaIHqtH7V2jIAOsTij2WHVUQ1_I",
  authDomain: "chat-c7a42.firebaseapp.com",
  projectId: "chat-c7a42",
  storageBucket: "chat-c7a42.firebasestorage.app",
  messagingSenderId: "79250645257",
  appId: "1:79250645257:web:f7b2c137c14ef0b23ff3d8"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
export default app;
export const db = getFirestore