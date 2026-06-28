import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBV4B67As_DNPzkk95kPcjI6JkQn5AbYuc",
    authDomain: "fortnite-sprite-tracker-20889.firebaseapp.com",
    projectId: "fortnite-sprite-tracker-20889",
    storageBucket: "fortnite-sprite-tracker-20889.firebasestorage.app",
    messagingSenderId: "122885949651",
    appId: "1:122885949651:web:0b6540968eedfcac742c26",
    measurementId: "G-LDBCKDH0PW"
};

const app = initializeApp(firebaseConfig);

// Export these so you can use them in your components
export const auth = getAuth(app);
export const db = getFirestore(app);