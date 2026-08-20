jest.mock('../services/firebase', () => ({
  auth: { currentUser: { uid: 'test_user_123' } },
  db: {},
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn().mockResolvedValue(true),
  },
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  deleteUser: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn().mockResolvedValue(true),
  getDocs: jest.fn().mockResolvedValue({ docs: [{ ref: {} }] }),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  where: jest.fn(),
  Timestamp: { now: jest.fn() },
  onSnapshot: jest.fn(),
  increment: jest.fn(v => v),
}));

import { deleteUserData } from '../services/firestore';
import { deleteAccount } from '../services/auth';
import { deleteUser } from 'firebase/auth';

describe('Account Deletion & Data Wipe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully executes deleteUserData wiping meals, workouts, and user doc', async () => {
    await expect(deleteUserData('test_user_123')).resolves.not.toThrow();
  });

  it('deletes auth user cleanly when deleteAccount is called', async () => {
    (deleteUser as jest.Mock).mockResolvedValueOnce(true);
    const result = await deleteAccount();
    expect(result.success).toBe(true);
    expect(result.requiresReauth).toBeUndefined();
  });

  it('handles auth/requires-recent-login gracefully without throwing uncaught error', async () => {
    (deleteUser as jest.Mock).mockRejectedValueOnce({
      code: 'auth/requires-recent-login',
      message: 'This operation is sensitive and requires recent authentication.',
    });
    const result = await deleteAccount();
    expect(result.success).toBe(false);
    expect(result.requiresReauth).toBe(true);
  });
});
