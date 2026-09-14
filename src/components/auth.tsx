'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

export type AppRole =
  | 'super_admin'
  | 'park_manager'
  | 'ranger'
  | 'operator'
  | 'finance'
  | 'auditor'
  | 'visitor';

export type DemoUser = {
  name: string;
  email: string;
  role: AppRole;
  mfa: boolean;
};

export const users: Record<AppRole, DemoUser> = {
  super_admin: { name: 'MPK Super Admin', email: 'admin@mpk.gov.my', role: 'super_admin', mfa: true },
  park_manager: { name: 'Park Manager', email: 'manager@mpk.gov.my', role: 'park_manager', mfa: true },
  ranger: { name: 'Ranger Hafiz', email: 'ranger.hafiz@mpk.gov.my', role: 'ranger', mfa: true },
  operator: { name: 'Chalet Operator', email: 'operator@mpk.gov.my', role: 'operator', mfa: true },
  finance: { name: 'Finance Officer', email: 'finance@mpk.gov.my', role: 'finance', mfa: true },
  auditor: { name: 'Auditor', email: 'auditor@mpk.gov.my', role: 'auditor', mfa: true },
  visitor: { name: 'Demo Visitor', email: 'visitor@example.com', role: 'visitor', mfa: false },
};

export const roleLabels: Record<AppRole, string> = {
  super_admin: 'Super Admin MPK',
  park_manager: 'Park Manager',
  ranger: 'Ranger',
  operator: 'Chalet Operator',
  finance: 'Finance',
  auditor: 'Auditor Read-only',
  visitor: 'Visitor',
};

type AuthContextValue = {
  user: DemoUser;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginWithInstagram: () => Promise<void>;
  loginWithTikTok: () => Promise<void>;
  loginWithX: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  login: (role: AppRole) => Promise<void>;
  logout: () => Promise<void>;
  canAccess: (view: string) => boolean;
  allowedViews: string[];
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('lambak-role');
      if (saved && users[saved as AppRole]) {
        setUser(users[saved as AppRole]);
      }
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      window.location.href = '/api/auth/signin/google';
    } catch (err) {
      console.error('Google login error:', err);
      setError('Failed to sign in with Google');
      setIsLoading(false);
    }
  }, []);

  const loginWithFacebook = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      window.location.href = '/api/auth/signin/facebook';
    } catch (err) {
      console.error('Facebook login error:', err);
      setError('Failed to sign in with Facebook');
      setIsLoading(false);
    }
  }, []);

  const loginWithApple = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      window.location.href = '/api/auth/signin/apple';
    } catch (err) {
      console.error('Apple login error:', err);
      setError('Failed to sign in with Apple');
      setIsLoading(false);
    }
  }, []);

  const loginWithInstagram = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      window.location.href = '/api/auth/signin/instagram';
    } catch (err) {
      console.error('Instagram login error:', err);
      setError('Failed to sign in with Instagram');
      setIsLoading(false);
    }
  }, []);

  const loginWithTikTok = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      window.location.href = '/api/auth/signin/tiktok';
    } catch (err) {
      console.error('TikTok login error:', err);
      setError('Failed to sign in with TikTok');
      setIsLoading(false);
    }
  }, []);

  const loginWithX = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      window.location.href = '/api/auth/signin/x';
    } catch (err) {
      console.error('X login error:', err);
      setError('Failed to sign in with X');
      setIsLoading(false);
    }
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Email login error:', err);
      setError('Failed to sign in with email');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (role: AppRole) => {
    setIsLoading(true);
    setError(null);
    try {
      const demoUser = users[role];
      if (demoUser) {
        setUser(demoUser);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('lambak-role', role);
        }
        await fetch('/api/v1/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role }),
        }).catch(() => undefined);
      }
    } catch (err) {
      console.error('Demo login error:', err);
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('lambak-role');
      }
      setUser(null);
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Logout failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const canAccess = useCallback((view: string) => {
    if (!user) return false;
    const viewPermissions: Record<AppRole, string[]> = {
      super_admin: ['visitor', 'trails', 'hike', 'mytrails', 'ranger', 'command', 'admin', 'api', 'sla', 'budget'],
      park_manager: ['visitor', 'trails', 'hike', 'mytrails', 'ranger', 'command', 'admin', 'api', 'sla', 'budget'],
      ranger: ['visitor', 'trails', 'hike', 'mytrails', 'ranger', 'command', 'sla'],
      operator: ['visitor', 'trails', 'hike', 'mytrails', 'ranger'],
      finance: ['visitor', 'trails', 'hike', 'mytrails', 'command', 'budget', 'sla'],
      auditor: ['visitor', 'trails', 'hike', 'mytrails', 'command', 'sla', 'api', 'budget'],
      visitor: ['visitor', 'trails', 'hike', 'mytrails'],
    };
    return viewPermissions[user.role]?.includes(view) ?? false;
  }, [user]);

  const allowedViews = useMemo(() => {
    if (!user) return [];
    const viewPermissions: Record<AppRole, string[]> = {
      super_admin: ['visitor', 'trails', 'hike', 'mytrails', 'ranger', 'command', 'admin', 'api', 'sla', 'budget'],
      park_manager: ['visitor', 'trails', 'hike', 'mytrails', 'ranger', 'command', 'admin', 'api', 'sla', 'budget'],
      ranger: ['visitor', 'trails', 'hike', 'mytrails', 'ranger', 'command', 'sla'],
      operator: ['visitor', 'trails', 'hike', 'mytrails', 'ranger'],
      finance: ['visitor', 'trails', 'hike', 'mytrails', 'command', 'budget', 'sla'],
      auditor: ['visitor', 'trails', 'hike', 'mytrails', 'command', 'sla', 'api', 'budget'],
      visitor: ['visitor', 'trails', 'hike', 'mytrails'],
    };
    return viewPermissions[user.role] ?? [];
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({
    user: user || {
      name: 'Demo Visitor',
      email: 'visitor@example.com',
      role: 'visitor',
      mfa: false,
    },
    loginWithGoogle,
    loginWithFacebook,
    loginWithApple,
    loginWithInstagram,
    loginWithTikTok,
    loginWithX,
    loginWithEmail,
    login,
    logout,
    canAccess,
    allowedViews,
    isLoading,
  }), [user, isLoading, loginWithGoogle, loginWithFacebook, loginWithApple, loginWithInstagram, loginWithTikTok, loginWithX, loginWithEmail, login, logout, canAccess, allowedViews]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading authentication...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export const demoUsers = users;
