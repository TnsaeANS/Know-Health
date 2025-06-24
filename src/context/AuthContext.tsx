
"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { auth } from '@/lib/firebase'; // auth can be null now
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  type User as FirebaseUser
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string; }>;
  logout: () => void;
  signup: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string; }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If auth is not initialized, don't do anything.
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const appUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          avatarUrl: firebaseUser.photoURL || undefined,
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string; }> => {
    if (!auth) {
      return { success: false, error: 'auth/not-configured' };
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return { success: true };
    } catch (error: any) {
      console.error("Firebase login error:", error.code);
      return { success: false, error: error.code };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase logout error:", error);
    }
  };

  const signup = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string; }> => {
    if (!auth) {
      return { success: false, error: 'auth/not-configured' };
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;
      if (firebaseUser) {
        await updateProfile(firebaseUser, {
          displayName: name,
        });
        const appUser: User = {
          id: firebaseUser.uid,
          name: name,
          email: firebaseUser.email || '',
          avatarUrl: firebaseUser.photoURL || undefined,
        };
        setUser(appUser);
      }
      return { success: true };
    } catch (error: any)
    {
      console.error("Firebase signup error:", error.code);
      return { success: false, error: error.code };
    } finally {
      setLoading(false);
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
