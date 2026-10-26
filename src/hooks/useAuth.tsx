import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Role, User } from '../types';
import * as auth from '../services/auth';
import { saveUser } from '../services/store';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => auth.AuthResult;
  register: (name: string, email: string, password: string, role: Role) => auth.AuthResult;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => auth.currentUser());

  useEffect(() => {
    const sync = () => setUser(auth.currentUser());
    window.addEventListener('mebelchi:store', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('mebelchi:store', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const login = useCallback((email: string, password: string) => {
    const res = auth.login(email, password);
    if (res.ok && res.user) setUser(res.user);
    return res;
  }, []);

  const register = useCallback((name: string, email: string, password: string, role: Role) => {
    const res = auth.register(name, email, password, role);
    if (res.ok && res.user) setUser(res.user);
    return res;
  }, []);

  const logout = useCallback(() => {
    auth.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<User>) => {
      if (!user) return;
      const next = { ...user, ...patch };
      saveUser(next);
      setUser(next);
    },
    [user],
  );

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
