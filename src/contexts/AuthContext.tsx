import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { get, post, readAuth, saveAuth } from '../lib/api';
import type { AuthResponse, UserInfo } from '../lib/types';

type AuthContextValue = {
  user: UserInfo | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};
const Context = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(readAuth()?.user || null);
  const [loading, setLoading] = useState(false);
  useEffect(() => { const listener = () => setUser(readAuth()?.user || null); window.addEventListener('drawing-auth-changed', listener); return () => window.removeEventListener('drawing-auth-changed', listener); }, []);
  const login = useCallback(async (email: string, password: string) => { setLoading(true); try { const result = await post<AuthResponse>('/api/v1/auth/login', { email, password }, false); saveAuth(result); setUser(result.user); } finally { setLoading(false); } }, []);
  const logout = useCallback(async () => { try { await post<void>('/api/v1/auth/logout'); } catch { } saveAuth(null); setUser(null); }, []);
  const refreshMe = useCallback(async () => { const result = await get<UserInfo>('/api/v1/auth/me', true); const auth = readAuth(); if (auth) saveAuth({ ...auth, user: result }); setUser(result); }, []);
  return <Context.Provider value={{ user, loading, isAdmin: !!user?.roles.some(role => role.toLowerCase() === 'admin'), login, logout, refreshMe }}>{children}</Context.Provider>;
}
export function useAuth() { const context = useContext(Context); if (!context) throw new Error('AuthProvider mövcud deyil'); return context; }
