'use client';

import { useEffect } from 'react';
import { useAuth, type AppRole } from '@/components/auth';

const roleNames: Record<AppRole, string> = {
  super_admin: 'Super Admin',
  park_manager: 'Park Manager',
  ranger: 'Ranger',
  operator: 'Chalet Operator',
  finance: 'Finance',
  auditor: 'Auditor',
  visitor: 'Visitor',
};

export function RoleGate({ role }: { role: AppRole }) {
  const { login, user } = useAuth();

  useEffect(() => {
    if (user.role !== role) {
      login(role);
    }
  }, [role, user.role, login]);

  if (user.role === role) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-forest-900">
      <div className="text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white">
          <svg className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <p className="text-sm font-bold text-slate-600 dark:text-emerald-100">
          Signing in as {roleNames[role]}…
        </p>
      </div>
    </div>
  );
}
