// src/firebase.js
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyABeS5z2UZ7M7UaWdaIsPYCtMx_5MSIwCs",
    authDomain: "carbon-tracker-5a625.firebaseapp.com",
    projectId: "carbon-tracker-5a625",
    storageBucket: "carbon-tracker-5a625.appspot.com",
    messagingSenderId: "544915420356",
    appId: "1:544915420356:web:886ece131bbd32f47a8591",
    measurementId: "G-P0SGS48ZB8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Function: Sign in with Google and create user in Firestore
const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                wardrobe: [],
                totalCarbonFootprint: 0,
                createdAt: serverTimestamp(),
            });
        }

        return user;
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        throw error;
    }
};

export {
    auth,
    googleProvider,
    db,
    signInWithGoogle
};
