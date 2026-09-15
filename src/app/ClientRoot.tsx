'use client';

import { useAuth } from '@/components/auth';
import { LandingPage } from '@/components/LandingPage';
import { AppShell } from '@/components/AppShell';

export function ClientRoot() {
  const { user } = useAuth();

  if (user.role === 'visitor' && !user.mfa) {
    return <LandingPage />;
  }

  return <AppShell />;
}
