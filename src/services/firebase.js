import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBtFve9t-CnC3E9VtAVEEi-0Wtr0eViFYM",
  authDomain: "fitpulse-89c0e.firebaseapp.com",
  projectId: "fitpulse-89c0e",
  storageBucket: "fitpulse-89c0e.firebasestorage.app",
  messagingSenderId: "1062137796931",
  appId: "1:1062137796931:android:f8a17ceb6c5e6e7b0a37f6",
};

const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApps()[0];
export const db = getFirestore(app);
