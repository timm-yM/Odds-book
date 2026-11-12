import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';
import { User } from '@/types';
import { authApi } from '@/lib/api/auth';
import { getToken, setToken, clearToken, getErrorMessage } from '@/lib/api/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const register = async (name: string, email: string, password: string) => {
    try {
      const { user: newUser, token } = await authApi.register({ name, email, password });
      setToken(token);
      setUser(newUser);
      toast.success(`Welcome to ODDSBOOK, ${newUser.name.split(' ')[0]}!`);
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user: loggedInUser, token } = await authApi.login({ email, password });
      setToken(token);
      setUser(loggedInUser);
      toast.success('Welcome back!');
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return false;
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
    authApi.logout().catch(() => undefined);
    toast.success('Signed out');
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin: user?.role === 'admin', register, login, logout, refreshUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
