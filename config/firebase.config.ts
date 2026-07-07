// ============================================================
//  FIREBASE CONFIGURATION
//  ⚠️  Replace placeholder values with your Firebase project config.
//  Get these from: Firebase Console → Project Settings → Your Apps → Web App
// ============================================================
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBtFve9t-CnC3E9VtAVEEi-0Wtr0eViFYM",
  authDomain: "fitpulse-89c0e.firebaseapp.com",
  projectId: "fitpulse-89c0e",
  storageBucket: "fitpulse-89c0e.firebasestorage.app",
  messagingSenderId: "1062137796931",
  appId: "1:1062137796931:android:f8a17ceb6c5e6e7b0a37f6",
};

export const IS_FIREBASE_CONFIGURED =
  !FIREBASE_CONFIG.apiKey.includes("YOUR_");
