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
  // Avoid initializing more than once (hot reload guard)
  app = getApps().length === 0
    ? initializeApp(FIREBASE_CONFIG)
    : getApps()[0];

  if (getApps().length === 1) {
    if (Platform.OS === 'web') {
      auth = getAuth(app);
    } else {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
  } else {
    auth = getAuth(app);
  }

  db = getFirestore(app);
} else {
  console.warn(
    '[TrueFit] Firebase is not configured. Edit config/firebase.config.ts with your project credentials.'
  );
}

export { app, auth, db, IS_FIREBASE_CONFIGURED };
