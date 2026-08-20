import { initializeApp, getApps } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_CONFIG, IS_FIREBASE_CONFIGURED } from '../config/firebase.config';

import { Platform } from 'react-native';

let app: ReturnType<typeof initializeApp>;
let auth: ReturnType<typeof getAuth>;
let db: ReturnType<typeof getFirestore>;

if (IS_FIREBASE_CONFIGURED) {
  try {
    app = getApps().length === 0
      ? initializeApp(FIREBASE_CONFIG)
      : getApps()[0];

    try {
      if (Platform.OS === 'web') {
        auth = getAuth(app);
      } else {
        auth = initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage),
        });
      }
    } catch (authErr) {
      // Fallback if initializeAuth was already invoked or persistence throws
      auth = getAuth(app);
    }

    db = getFirestore(app);
  } catch (err) {
    console.error('[FitKobra] Error initializing Firebase app/auth/db:', err);
  }
} else {
  console.warn(
    '[FitKobra] Firebase is not configured. Edit config/firebase.config.ts with your project credentials.'
  );
}

export { app, auth, db, IS_FIREBASE_CONFIGURED };
