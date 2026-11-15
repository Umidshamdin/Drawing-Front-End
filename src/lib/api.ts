import { apiBase, qs } from './helpers';
import type { AuthResponse } from './types';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const tokenKey = 'drawing.auth';
export const readAuth = (): AuthResponse | null => { try { return JSON.parse(sessionStorage.getItem(tokenKey) || 'null') as AuthResponse | null; } catch { return null; } };
export const saveAuth = (value: AuthResponse | null) => { if (value) sessionStorage.setItem(tokenKey, JSON.stringify(value)); else sessionStorage.removeItem(tokenKey); window.dispatchEvent(new Event('drawing-auth-changed')); };
let refreshing: Promise<AuthResponse | null> | null = null;

async function refreshAccess(): Promise<AuthResponse | null> {
  if (refreshing) return refreshing;
  refreshing = (async () => {
    const stored = readAuth();
    if (!stored?.refreshToken) return null;
    try {
      const res = await fetch(`${apiBase}/api/v1/auth/refresh`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken: stored.refreshToken }) });
      if (!res.ok) { saveAuth(null); return null; }
      const next = await res.json() as AuthResponse;
      saveAuth(next);
      return next;
    } catch { return null; }
  })();
  try { return await refreshing; } finally { refreshing = null; }
}

export async function api<T>(path: string, init: RequestInit = {}, requireAuth = false, retry = true): Promise<T> {
  const auth = readAuth();
  const headers = new Headers(init.headers || {});
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (auth?.accessToken) headers.set('Authorization', `Bearer ${auth.accessToken}`);
  if (requireAuth && !auth) throw new ApiError(401, 'Davam etmək üçün hesabınıza daxil olun.');
  let response: Response;
  try { response = await fetch(`${apiBase}${path}`, { ...init, headers }); }
  catch { throw new ApiError(0, 'Backend serverinə qoşulmaq mümkün olmadı. Drawing.API-ni işə salın.'); }
  if (response.status === 401 && auth && retry && path !== '/api/v1/auth/refresh') {
    const renewed = await refreshAccess();
    if (renewed) return api<T>(path, init, requireAuth, false);
    saveAuth(null);
  }
  if (!response.ok) {
    let message = response.status === 403 ? 'Bu əməliyyat üçün icazəniz yoxdur.' : `Server xətası (${response.status}).`;
    try { const body = await response.json(); message = body.detail || body.message || body.title || message; } catch { }
    throw new ApiError(response.status, String(message));
  }
  if (response.status === 204 || response.status === 205) return undefined as T;
  const text = await response.text();
  if (!text) return undefined as T;
  try { return JSON.parse(text) as T; } catch { return text as T; }
}

export const get = <T>(path: string, auth = false) => api<T>(path, {}, auth);
export const post = <T>(path: string, body?: unknown, auth = true) => api<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }, auth);
export const put = <T>(path: string, body: unknown, auth = true) => api<T>(path, { method: 'PUT', body: JSON.stringify(body) }, auth);
export const patch = <T>(path: string, body: unknown, auth = true) => api<T>(path, { method: 'PATCH', body: JSON.stringify(body) }, auth);
export const del = <T>(path: string, auth = true) => api<T>(path, { method: 'DELETE' }, auth);
export const upload = <T>(path: string, file: File, auth = true) => { const body = new FormData(); body.append('file', file); return api<T>(path, { method: 'POST', body }, auth); };
export const listUrl = (path: string, values: Record<string, string | number | boolean | null | undefined>) => { const query = qs(values); return `${path}${query ? `?${query}` : ''}`; };
