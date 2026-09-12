# Better-Auth Migration Plan for Serenity

## Overview
This plan outlines the migration from the current dual authentication system (custom JWT + NextAuth.js) to a unified better-auth solution.

## Current Authentication Systems
1. **Custom JWT Implementation** (`src/lib/auth.ts`)
   - Email/password authentication
   - Session token creation/verification
   - Cookie management
   - Password hashing/bcrypt

2. **NextAuth.js OAuth System** (`src/lib/auth/nextauth.ts`)
   - Google OAuth provider
   - Facebook OAuth provider  
   - Custom Instagram OAuth provider
   - Session management with JWT
   - Route protection (`/app/api/auth/[...nextauth]/route.ts`)

## Migration Strategy
Replace both systems with a single better-auth implementation that provides:
- Credentials authentication (email/password)
- OAuth providers (Google, Facebook, Instagram)
- Session management
- User management
- API route handlers

## Environment Variables Required
Better-auth will use the existing environment variables with these mappings:
- `AUTH_SECRET` → Better-auth secret (can reuse `NEXTAUTH_SECRET` or `AUTH_SECRET`)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` → Google OAuth
- `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET` → Facebook OAuth
- `INSTAGRAM_CLIENT_ID` / `INSTAGRAM_CLIENT_SECRET` → Instagram OAuth
- Database connection via existing Drizzle setup

## Migration Steps

### Phase 1: Setup and Email/Password Migration
1. Install better-auth and required plugins:
   ```bash
   npm install better-auth
   npm install @better-auth/drizzle-adapter drizzle-orm pg
   ```

2. Create better-auth configuration file (`src/lib/better-auth.ts`):
   ```typescript
   import { betterAuth } from "better-auth";
   import { drizzleAdapter } from "better-auth/adapters/drizzle";
   import { db } from "@/db";
   import { users } from "@/db/schema";

   export const auth = betterAuth({
     database: drizzleAdapter(db, {
       provider: "pg", // or "postgres"
       schema: {
         user: {
           id: users.id,
           name: users.name,
           email: users.email,
           password: users.passwordHash,
           // Map other fields as needed
         }
       }
     }),
     emailAndPassword: {
       enabled: true,
       requireEmailVerification: false, // Adjust as needed
       autoSignIn: true,
       sendResetPassword: ({ user, url }) => {
         // Implement email sending (resend, nodemailer, etc.)
         console.log(`Reset password for ${user.email}: ${url}`);
       },
       sendVerifyEmail: ({ user, url }) => {
         // Implement email sending
         console.log(`Verify email for ${user.email}: ${url}`);
       }
     },
     // Social providers will be added in Phase 2
   });
   ```

3. Replace custom JWT functions with better-auth equivalents:
   - `createSessionToken` → `auth.createSession`
   - `verifySessionToken` → `auth.validateSession`
   - `setSessionCookie` → handled automatically by better-auth
   - `clearSessionCookie` → `auth.revokeSession`
   - `getSession` → `auth.getSession`
   - `getCurrentUser` → extract from session

4. Update `src/lib/auth.ts` to use better-auth instead of custom implementation

5. Update API routes (`src/app/api/auth/login/route.ts` and `register/route.ts`) to use better-auth

### Phase 2: OAuth Providers Migration
1. Add OAuth providers to better-auth configuration:
   ```typescript
   import { betterAuth } from "better-auth";
   import { drizzleAdapter } from "better-auth/adapters/drizzle";
   import { github } from "better-auth/plugins";
   import { google } from "better-auth/plugins";
   import { facebook } from "better-auth/plugins";
   // Instagram may require custom OAuth2 provider

   export const auth = betterAuth({
     // ... database config from Phase 1
     emailAndPassword: { /* ... */ },
     socialProviders: [
       google({
         clientId: process.env.GOOGLE_CLIENT_ID as string,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
       }),
       facebook({
         clientId: process.env.FACEBOOK_CLIENT_ID as string,
         clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
       }),
       // Add Instagram similarly or as custom OAuth2 provider
     ]
   });
   ```

2. Replace NextAuth configuration in `src/lib/auth/nextauth.ts` with better-auth OAuth setup

3. Update or remove `/app/api/auth/[...nextauth]/route.ts` as better-auth provides its own endpoints

### Phase 3: Session and API Route Updates
1. Update session-dependent code throughout the app to use better-auth session methods
2. Ensure API routes that check authentication use better-auth validation
3. Test all authentication flows:
   - Email/password registration
   - Email/password login
   - OAuth login (Google, Facebook, Instagram)
   - Session persistence
   - Logout
   - Protected route access

### Phase 4: Cleanup
1. Remove NextAuth dependencies:
   ```bash
   npm remove next-auth
   ```
2. Remove unused files:
   - `src/lib/auth/nextauth.ts`
   - `src/lib/auth.ts` (after functions are migrated/replaced)
   - `src/app/api/auth/[...nextauth]/route.ts` (if not needed)
3. Remove unused imports and references throughout codebase

## API Route Considerations
Better-auth provides automatic API endpoints at `/api/auth/*` by default. Options for existing routes:

### Option A: Use better-auth endpoints (Recommended)
- Remove custom login/register routes
- Let better-auth handle `/api/auth/email/register`, `/api/auth/email/login`, etc.
- Update frontend calls to match better-auth endpoint structure

### Option B: Keep custom routes with better-auth backend
- Keep existing route structure (`/app/api/auth/login/route.ts`)
- Update route handlers to use better-auth methods instead of custom JWT
- Maintain backward compatibility with existing API contracts

### Option C: Hybrid approach
- Use better-auth for OAuth endpoints (`/api/auth/oauth/*`)
- Keep custom email/password routes but powered by better-auth

**Recommendation**: Option A for cleaner implementation, unless there are specific frontend compatibility requirements.

## Testing Strategy
1. Unit test auth helper functions
2. Integration test authentication flows:
   - Registration → Login → Access protected route → Logout
   - OAuth login flows
   - Invalid credentials handling
   - Token refresh/expiration
3. Test session persistence across page reloads
4. Verify existing functionality remains intact

## Rollback Plan
Since this is a significant migration:
1. Keep backup of original auth files
2. Implement migration in a feature branch
3. Feature flag the new auth system if needed
4. Monitor error rates and user reports closely after deployment
5. Be prepared to revert to original systems if critical issues arise

## Estimated Effort
- Phase 1 (Setup + Email/Password): 2-3 days
- Phase 2 (OAuth Providers): 1-2 days  
- Phase 3 (Session/API Updates): 2-3 days
- Phase 4 (Cleanup): 1 day
- Testing: Throughout process

Total: 6-9 days development time

## Benefits of Migration
1. **Reduced Complexity**: Single auth system instead of two
2. **Better Maintenance**: One library to update, one set of docs
3. **Enhanced Features**: Better session handling, security, and developer experience
4. **Alignment with Documentation**: Matches references in Neon Functions skills
5. **Future-Proof**: Better-auth is actively maintained with growing ecosystem
6. **Reduced Bundle Size**: Despite adding a library, removing two systems may net positive

## Risks and Mitigations
1. **Migration Errors**: Mitigate with thorough testing and gradual rollout
2. **Session Incompatibility**: Handle existing session migration or allow coexistence temporarily
3. **OAuth Provider Differences**: Carefully map provider configurations and test thoroughly
4. **API Contract Changes**: Maintain backward compatibility or update frontend accordingly
5. **Learning Curve**: Team familiarity with better-auth vs current systems

