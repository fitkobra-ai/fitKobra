import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  deleteUser,
  GoogleAuthProvider,
  signInWithCredential,
  type User,
} from 'firebase/auth';
import { auth } from './firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const GOOGLE_WEB_CLIENT_ID = '1062137796931-cnvf4pmeqkkkofj0q2qmsv216m8revs3.apps.googleusercontent.com';

try {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: false,
    forceCodeForRefreshToken: false,
  });
} catch (e) {
  console.warn('[GoogleSignin] configure error at module load:', e);
}

function ensureGoogleSigninConfigured() {
  try {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: false,
      forceCodeForRefreshToken: false,
    });
  } catch (e) {
    console.warn('[GoogleSignin] configure error:', e);
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  try {
    await sendEmailVerification(cred.user);
  } catch (e) {
    console.warn('[Auth] Verification email send warning:', e);
  }
  return cred.user;
}

export async function resendVerificationEmail(user: User): Promise<void> {
  if (user) {
    await sendEmailVerification(user);
  }
}

export async function reloadUser(user: User): Promise<User> {
  if (user) {
    await user.reload();
  }
  return auth?.currentUser || user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signInWithGoogle(): Promise<User> {
  ensureGoogleSigninConfigured();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  try {
    const response = await GoogleSignin.signIn();
    const idToken = response?.data?.idToken || (response as any)?.idToken;
    if (!idToken) throw new Error('No ID token returned from Google Sign-In');
    
    const credential = GoogleAuthProvider.credential(idToken);
    const cred = await signInWithCredential(auth, credential);
    return cred.user;
  } catch (err: any) {
    console.error('[GoogleSignin] Raw error:', err);
    const errCode = String(err?.code || '');
    const errStr = String(err?.message || err);
    
    if (errCode === '10' || errStr.includes('DEVELOPER_ERROR') || errStr.includes('10')) {
      throw new Error(`Google Sign-In Error Code 10 (DEVELOPER_ERROR).\nRaw: ${errStr}\n\nPlease verify:\n1. Google Sign-In Provider is ENABLED in Firebase Console -> Authentication -> Sign-in method.\n2. ALL 3 SHA-1 keys are under com.fitkobra.app in Firebase Console.`);
    }
    if (errCode === '13' || errStr.includes('CANCELLED')) {
      throw new Error('Google Sign-In was cancelled.');
    }
    throw new Error(`Google Sign-In failed (${errCode}): ${errStr}`);
  }
}

export async function signOut(): Promise<void> {
  try {
    ensureGoogleSigninConfigured();
    await GoogleSignin.signOut();
  } catch (e) {
    // Ignore error if not signed in with Google
  }
  await firebaseSignOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function deleteAccount(): Promise<{ success: boolean; requiresReauth?: boolean }> {
  if (!auth.currentUser) throw new Error('No user is currently logged in');
  try {
    await deleteUser(auth.currentUser);
    return { success: true };
  } catch (err: any) {
    console.warn('deleteUser error:', err);
    if (err?.code === 'auth/requires-recent-login' || err?.message?.includes('requires-recent-login')) {
      return { success: false, requiresReauth: true };
    }
    throw err;
  }
}
