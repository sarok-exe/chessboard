import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC_le8dDAxFGEQIA3-HSpMRPqAHXcc7LK4",
    authDomain: "sarok-archive.firebaseapp.com",
    databaseURL: "https://sarok-archive-default-rtdb.firebaseio.com",
    projectId: "sarok-archive",
    storageBucket: "sarok-archive.appspot.com",
    messagingSenderId: "757187662983",
    appId: "1:757187662983:web:5fa09d7d4c248505a3d422",
    measurementId: "G-H8XTY68LXE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
