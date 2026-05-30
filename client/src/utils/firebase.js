import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-3eb29.firebaseapp.com",
  projectId: "interviewiq-3eb29",
  storageBucket: "interviewiq-3eb29.firebasestorage.app",
  messagingSenderId: "657226146003",
  appId: "1:657226146003:web:81d82a664571d6461d7426"
};

// initialize firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export {auth, provider};