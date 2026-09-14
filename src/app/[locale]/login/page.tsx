"use client";

import LandingPage from "@/components/LandingPage";
import { AuthProvider } from "@/components/auth";

export default function LoginPage() {
  return (
    <AuthProvider>
      <LandingPage />
    </AuthProvider>
  );
}
