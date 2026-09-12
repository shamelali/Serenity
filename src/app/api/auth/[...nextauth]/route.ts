// This file is required for Better Auth to work with Next.js App Router
// It re-exports the Better Auth instance from our lib/auth/nextauth.ts
// The [...nextauth] route handler will handle all auth-related requests

import { GET, POST, PATCH, PUT, DELETE } from "@/lib/auth/nextauth";

export { GET, POST, PATCH, PUT, DELETE };