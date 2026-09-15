'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ViewKey } from '@/lib/types';

export type AppRole =
  | 'super_admin'
  | 'park_manager'
  | 'ranger'
  | 'operator'
  | 'finance'
  | 'auditor'
  | 'visitor';

export type SocialProvider = 'google' | 'apple' | 'facebook' | 'instagram' | 'tiktok' | 'x';

export type DemoUser = {
  name: string;
  email: string;
  role: AppRole;
  mfa: boolean;
  avatar?: string;
  provider?: SocialProvider;
  department?: string;
  joinedDate?: string;
};

export const users: Record<AppRole, DemoUser> = {
  super_admin: {
    name: 'MPK Super Admin',
    email: 'admin@mpk.gov.my',
    role: 'super_admin',
    mfa: true,
    department: 'Administration',
    joinedDate: '2024-01-15',
  },
  park_manager: {
    name: 'Park Manager',
    email: 'manager@mpk.gov.my',
    role: 'park_manager',
    mfa: true,
    department: 'Park Operations',
    joinedDate: '2024-03-20',
  },
  ranger: {
    name: 'Ranger Hafiz',
    email: 'ranger.hafiz@mpk.gov.my',
    role: 'ranger',
    mfa: true,
    department: 'Field Operations',
    joinedDate: '2024-06-10',
  },
  operator: {
    name: 'Chalet Operator',
    email: 'operator@mpk.gov.my',
    role: 'operator',
    mfa: true,
    department: 'Facility Management',
    joinedDate: '2024-04-05',
  },
  finance: {
    name: 'Finance Officer',
    email: 'finance@mpk.gov.my',
    role: 'finance',
    mfa: true,
    department: 'Finance & Budget',
    joinedDate: '2024-02-28',
  },
  auditor: {
    name: 'Auditor',
    email: 'auditor@mpk.gov.my',
    role: 'auditor',
    mfa: true,
    department: 'Compliance & Audit',
    joinedDate: '2024-05-12',
  },
  visitor: {
    name: 'Demo Visitor',
    email: 'visitor@example.com',
    role: 'visitor',
    mfa: false,
    department: 'Public',
    joinedDate: '2024-07-01',
  },
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

export const roleColors: Record<AppRole, string> = {
  super_admin: 'bg-red-500',
  park_manager: 'bg-emerald-500',
  ranger: 'bg-blue-500',
  operator: 'bg-orange-500',
  finance: 'bg-purple-500',
  auditor: 'bg-gray-500',
  visitor: 'bg-teal-500',
};

const hikeViews: ViewKey[] = ['trails', 'hike', 'mytrails'];

const permissions: Record<AppRole, ViewKey[]> = {
  super_admin: ['visitor', ...hikeViews, 'ranger', 'command', 'admin', 'api', 'sla', 'budget'],
  park_manager: ['visitor', ...hikeViews, 'ranger', 'command', 'admin', 'api', 'sla', 'budget'],
  ranger: ['visitor', ...hikeViews, 'ranger', 'command', 'sla'],
  operator: ['visitor', ...hikeViews, 'ranger'],
  finance: ['visitor', ...hikeViews, 'command', 'budget', 'sla'],
  auditor: ['visitor', ...hikeViews, 'command', 'sla', 'api', 'budget'],
  visitor: ['visitor', ...hikeViews],
};

const providerToRole: Record<SocialProvider, AppRole> = {
  google: 'super_admin',
  apple: 'ranger',
  facebook: 'park_manager',
  instagram: 'operator',
  tiktok: 'finance',
  x: 'auditor',
};

type AuthContextValue = {
  user: DemoUser;
  login: (role: AppRole, provider?: SocialProvider) => Promise<void>;
  loginWithProvider: (provider: SocialProvider) => Promise<void>;
  loginWithGoogle: () => void;
  loginWithFacebook: () => void;
  loginWithApple: () => void;
  loginWithInstagram: () => void;
  loginWithTikTok: () => void;
  loginWithX: () => void;
  logout: () => Promise<void>;
  canAccess: (view: ViewKey) => boolean;
  allowedViews: ViewKey[];
  isLoggedIn: boolean;
  isLoggingIn: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function initialRole(): AppRole {
  if (typeof window === 'undefined') return 'visitor';
  const saved = window.localStorage.getItem('lambak-role') as AppRole | null;
  return saved && users[saved] ? saved : 'visitor';
}

async function doLogin(nextRole: AppRole, provider: SocialProvider | undefined, setRole: (r: AppRole) => void, setLoggingIn: (v: boolean) => void) {
  setLoggingIn(true);
  setRole(nextRole);

  window.localStorage.setItem('lambak-role', nextRole);
  if (provider) {
    window.localStorage.setItem('lambak-provider', provider);
  }

  await fetch('/api/v1/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: nextRole, provider }),
  }).catch(() => undefined);

  setLoggingIn(false);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<AppRole>(initialRole);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [provider, setProvider] = useState<SocialProvider | undefined>(() => {
    if (typeof window === 'undefined') return undefined;
    return (window.localStorage.getItem('lambak-provider') as SocialProvider) || undefined;
  });

  useEffect(() => {
    if (role === 'visitor') return;
    fetch('/api/v1/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, provider }),
    }).catch(() => undefined);
  }, [role, provider]);

  const login = useCallback(async (nextRole: AppRole, loginProvider?: SocialProvider) => {
    setProvider(loginProvider);
    await doLogin(nextRole, loginProvider, setRole, setIsLoggingIn);
  }, []);

  const loginWithProvider = useCallback(async (loginProvider: SocialProvider) => {
    const mappedRole = providerToRole[loginProvider];
    await doLogin(mappedRole, loginProvider, setRole, setIsLoggingIn);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user: { ...users[role], provider },
    login,
    loginWithProvider,
    loginWithGoogle: () => loginWithProvider('google'),
    loginWithFacebook: () => loginWithProvider('facebook'),
    loginWithApple: () => loginWithProvider('apple'),
    loginWithInstagram: () => loginWithProvider('instagram'),
    loginWithTikTok: () => loginWithProvider('tiktok'),
    loginWithX: () => loginWithProvider('x'),
    logout: async () => {
      setRole('visitor');
      setProvider(undefined);
      window.localStorage.setItem('lambak-role', 'visitor');
      window.localStorage.removeItem('lambak-provider');
      await fetch('/api/v1/session', { method: 'DELETE' }).catch(() => undefined);
    },
    canAccess: (view) => permissions[role].includes(view),
    allowedViews: permissions[role],
    isLoggedIn: role !== 'visitor',
    isLoggingIn,
  }), [role, provider, login, loginWithProvider, isLoggingIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export const demoUsers = users;
