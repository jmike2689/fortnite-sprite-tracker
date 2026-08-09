import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

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

export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
    } else if (err.code == 'unimplemented') {
        console.warn('The current browser does not support all of the features required to enable persistence');
    }
});