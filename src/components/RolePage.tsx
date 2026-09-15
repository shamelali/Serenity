'use client';

import { AuthProvider, useAuth, type AppRole } from '@/components/auth';
import { AppShell } from '@/components/AppShell';
import { VisitorView } from '@/components/VisitorView';
import { useEffect } from 'react';

function RoleLoader({ role }: { role: AppRole }) {
  const { login, user } = useAuth();

  useEffect(() => {
    if (user.role !== role) {
      login(role);
    }
  }, [role, user.role, login]);

  if (role === 'visitor') {
    return <VisitorView />;
  }

  return <AppShell />;
}

export function RolePage({ role }: { role: AppRole }) {
  return (
    <AuthProvider>
      <RoleLoader role={role} />
    </AuthProvider>
  );
}
