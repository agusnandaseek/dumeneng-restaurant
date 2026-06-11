'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export type AdminRole = 'admin' | 'user';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  role: AdminRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  user: null,
  role: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch role from Firestore admins collection
        try {
          const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
          if (adminDoc.exists()) {
            setRole(adminDoc.data().role as AdminRole);
          } else {
            setRole(null);
          }
        } catch {
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Check if user exists in admins collection
      try {
        const adminDoc = await getDoc(doc(db, 'admins', cred.user.uid));
        if (!adminDoc.exists()) {
          await signOut(auth);
          return { success: false, error: 'Akun ini tidak terdaftar sebagai admin. Tambahkan document admins/' + cred.user.uid + ' di Firestore.' };
        }
      } catch (firestoreErr: any) {
        await signOut(auth);
        return { success: false, error: 'Gagal akses Firestore: ' + (firestoreErr.message || 'permission denied').substring(0, 80) };
      }
      return { success: true };
    } catch (err: any) {
      const code = err.code;
      let error = 'Login gagal';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        error = 'Email atau password salah';
      } else if (code === 'auth/invalid-email') {
        error = 'Format email tidak valid';
      } else if (code === 'auth/too-many-requests') {
        error = 'Terlalu banyak percobaan. Coba lagi nanti.';
      }
      return { success: false, error };
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user && !!role,
        user,
        role,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
