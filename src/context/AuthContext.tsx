"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/mockData'; // For mock login

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>; // Simple mock login
  logout: () => void;
  signup: (name: string, email: string, pass: string) => Promise<boolean>; // Simple mock signup
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for a logged-in user in localStorage (simple persistence)
    const storedUser = localStorage.getItem('ethiohealth-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _pass: string): Promise<boolean> => {
    // Mock login: find user by email
    setLoading(true);
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('ethiohealth-user', JSON.stringify(foundUser));
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ethiohealth-user');
  };

  const signup = async (name: string, email: string, _pass: string): Promise<boolean> => {
    setLoading(true);
    // Mock signup: check if email exists
    if (mockUsers.find(u => u.email === email)) {
      setLoading(false);
      return false; // User already exists
    }
    const newUser: User = { id: `user-${Date.now()}`, name, email, avatarUrl: 'https://placehold.co/100x100.png' };
    mockUsers.push(newUser); // Add to mock data in memory (not persistent across reloads unless also stored)
    setUser(newUser);
    localStorage.setItem('ethiohealth-user', JSON.stringify(newUser));
    setLoading(false);
    return true;
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
