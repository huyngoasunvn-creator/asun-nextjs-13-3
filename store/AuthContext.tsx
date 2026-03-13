
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
// Correct named imports from modular SDK
import { 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";
// Importing User type separately to ensure compatibility in some TS environments
import type { User } from "firebase/auth";
import { auth } from "../services/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Subscribing to auth state using modular SDK function
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Cấu hình email có quyền Admin cao nhất
      if (currentUser && currentUser.email === 'admin@droppii.vn') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    // Calling modular signOut
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
