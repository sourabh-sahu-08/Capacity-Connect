import { create } from 'zustand';
import type { User } from 'shared';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (updatedFields: Partial<User>) => void;
  logout: () => void;
}

const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const entry = document.cookie.split('; ').find((value) => value.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null;
};

const setCookie = (name: string, value: string, maxAge = AUTH_COOKIE_MAX_AGE) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
};

const removeCookie = (name: string) => setCookie(name, '', 0);

const syncAuthCookies = (user: User, token: string) => {
  if (!hasAuthCookieConsent()) return;
  setCookie('cc_token', token);
  setCookie('cc_user', JSON.stringify(user));
};

export const hasAuthCookieConsent = () => getCookie('cc_cookie_consent') === 'accepted';

export const setAuthCookieConsent = (accepted: boolean) => {
  if (!accepted) {
    removeCookie('cc_cookie_consent');
    removeCookie('cc_token');
    removeCookie('cc_user');
    return;
  }

  setCookie('cc_cookie_consent', 'accepted', 60 * 60 * 24 * 365);
  const token = getStoredToken();
  const user = getStoredUser();
  if (token && user) syncAuthCookies(user, token);
};

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem('user');
    if (raw) return JSON.parse(raw);
  } catch {
    // Fall back to the cookie below when local storage is unavailable.
  }

  try {
    const raw = getCookie('cc_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem('token') || getCookie('cc_token');
  } catch {
    return getCookie('cc_token');
  }
};

const initialUser = getStoredUser();
const initialToken = getStoredToken();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!(initialUser && initialToken),
  setAuth: (user, token) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      syncAuthCookies(user, token);
    } catch (e) {
      console.error('Failed to save auth to localStorage:', e);
    }
    set({ user, token, isAuthenticated: true });
  },
  updateUser: (updatedFields) => {
    set((state) => {
      if (!state.user) return { user: null };
      const updatedUser = { ...state.user, ...updatedFields };
      try {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (e) {
        console.error('Failed to update user in localStorage:', e);
      }
      return { user: updatedUser };
    });
  },
  logout: () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      removeCookie('cc_token');
      removeCookie('cc_user');
    } catch (e) {
      console.error('Failed to remove auth from localStorage:', e);
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
