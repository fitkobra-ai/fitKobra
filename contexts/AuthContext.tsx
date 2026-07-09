import React, {
  createContext, useContext, useEffect, useState, type ReactNode
} from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, IS_FIREBASE_CONFIGURED } from '../services/firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isConfigured: IS_FIREBASE_CONFIGURED,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!IS_FIREBASE_CONFIGURED) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = React.useMemo(() => ({ user, loading, isConfigured: IS_FIREBASE_CONFIGURED }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
