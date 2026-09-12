// This file is required for NextAuth to work with Next.js App Router
// It re-exports the NextAuth instance from our lib/auth/nextauth.ts
// The [...nextauth] route handler will handle all auth-related requests

import NextAuth from "@/lib/auth/nextauth";

export { NextAuth as GET, NextAuth as POST };