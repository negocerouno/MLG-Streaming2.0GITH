import React, { createContext, useContext, useState, useEffect } from "react";

type User = { name: string; email: string };

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const MOCK_CREDENTIALS = { email: "admin@streamsaas.com", password: "admin123" };
const MOCK_USER: User = { name: "Admin User", email: "admin@streamsaas.com" };
const STORAGE_KEY = "stream_auth";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (email: string, password: string): boolean => {
    if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
      setUser(MOCK_USER);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USER));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
