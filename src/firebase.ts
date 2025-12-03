import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyAX1iPxLR8oHM_06hz5YZpV89mCr2cCPTM",
  authDomain: "cis371-f015e.firebaseapp.com",
  projectId: "cis371-f015e",
  storageBucket: "cis371-f015e.firebasestorage.app",
  messagingSenderId: "652231514148",
  appId: "1:652231514148:web:8dd98ca8bec905791260b1"
};
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
