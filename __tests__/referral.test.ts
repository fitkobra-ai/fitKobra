jest.mock('../services/firebase', () => ({
  auth: {},
  db: {},
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  where: jest.fn(),
  Timestamp: { now: jest.fn() },
  onSnapshot: jest.fn(),
  increment: jest.fn(val => val),
}));

import { generateReferralCode, redeemReferralCode } from '../services/firestore';
import { getDocs, getDoc } from 'firebase/firestore';

describe('Referral System', () => {
  it('generates a valid referral code format starting with FITKOBRA-', () => {
    const code = generateReferralCode();
    expect(code).toBeDefined();
    expect(code.startsWith('FITKOBRA-')).toBe(true);
    expect(code.length).toBe(13);
  });

  it('generates distinct referral codes', () => {
    const code1 = generateReferralCode();
    const code2 = generateReferralCode();
    expect(code1).not.toEqual(code2);
  });

  it('returns invalid error when code is empty', async () => {
    const result = await redeemReferralCode('user123', '');
    expect(result.success).toBe(false);
    expect(result.message).toContain('Please enter a valid referral code');
  });

  it('redeems valid promo codes successfully', async () => {
    (getDoc as jest.Mock).mockResolvedValueOnce({ exists: () => false });
    const result = await redeemReferralCode('user123', 'FITKOBRA-7A2F');
    expect(result.success).toBe(true);
    expect(result.message).toContain('+10 AI Credits');
  });

  it('returns invalid error when code is not found', async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({ empty: true, docs: [] });
    const result = await redeemReferralCode('user123', 'INVALID1');
    expect(result.success).toBe(false);
    expect(result.message).toContain('Invalid referral code');
  });

  it('prevents user from using their own referral code', async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({
      empty: false,
      docs: [{ id: 'user123', ref: {} }]
    });
    const result = await redeemReferralCode('user123', 'FITKOBRA-1234');
    expect(result.success).toBe(false);
    expect(result.message).toBe('You cannot use your own referral code.');
  });

  it('prevents user from redeeming multiple referral codes', async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({
      empty: false,
      docs: [{ id: 'friend456', ref: {} }]
    });
    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ profile: { usedReferralCode: true } })
    });
    const result = await redeemReferralCode('user123', 'FITKOBRA-5678');
    expect(result.success).toBe(false);
    expect(result.message).toBe('You have already redeemed a referral code.');
  });

  it('successfully redeems valid referral code and awards both users', async () => {
    const mockReferrerRef = {};
    (getDocs as jest.Mock).mockResolvedValueOnce({
      empty: false,
      docs: [{ id: 'friend456', ref: mockReferrerRef }]
    });
    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ profile: { usedReferralCode: false } })
    });
    const result = await redeemReferralCode('user123', '5678'); // Test without FITKOBRA- prefix
    expect(result.success).toBe(true);
    expect(result.message).toContain('Referral code redeemed');
  });
});
