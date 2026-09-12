import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins/generic-oauth";
import { db } from "@/db";
import { users } from "@/db/schema";

// Map our existing users table to better-auth expected format
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // PostgreSQL
    schema: {
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        // We're not using better-auth for password auth, so we don't map password
        // But we need to include it for the schema to work
        password: users.passwordHash,
      },
    }
  }),
  // Enable social providers (OAuth) using generic-oauth plugin
  plugins: [
    genericOAuth({
      config: [
        // Google OAuth provider
        {
          providerId: "google",
          name: "Google",
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
          tokenUrl: "https://oauth2.googleapis.com/token",
          userInfoUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
          scopes: ["openid", "email", "profile"],
          // Google uses 'sub' as the subject identifier
          accountSubject: (context) => {
            const sub = context.profile.sub ?? context.profile.id;
            // Assuming these values are always present from Google
            return Promise.resolve(sub as string | number);
          },
        },
        // Facebook OAuth provider
        {
          providerId: "facebook",
          name: "Facebook",
          clientId: process.env.FACEBOOK_CLIENT_ID as string,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
          authorizationUrl: "https://www.facebook.com/v18.0/dialog/oauth",
          tokenUrl: "https://graph.facebook.com/v18.0/oauth/access_token",
          userInfoUrl: "https://graph.facebook.com/me?fields=id,name,email,picture",
          scopes: ["email", "public_profile"],
          // Facebook uses 'id' as the subject identifier
          accountSubject: (context) => {
            const id = context.profile.id;
            // Assuming this value is always present from Facebook
            return Promise.resolve(id as string | number);
          },
        },
        // Instagram OAuth provider
        {
          providerId: "instagram",
          name: "Instagram",
          clientId: process.env.INSTAGRAM_CLIENT_ID as string,
          clientSecret: process.env.INSTAGRAM_CLIENT_SECRET as string,
          authorizationUrl: "https://api.instagram.com/oauth/authorize",
          tokenUrl: "https://api.instagram.com/oauth/access_token",
          // For Instagram, we need to use getUserInfo to construct the URL with the access token
          scopes: ["user_profile", "user_media"],
          // Instagram uses 'id' as the subject identifier
          accountSubject: (context) => {
            const id = context.profile.id;
            // Assuming this value is always present from Instagram
            return Promise.resolve(id as string | number);
          },
          // Custom function to fetch user info for Instagram
          getUserInfo: async (tokens) => {
            const response = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${tokens.accessToken}`);
            if (!response.ok) {
              throw new Error("Failed to fetch Instagram user info");
            }
            return response.json();
          },
        },
      ]
    }),
  ],
  // Enable email and password (but we won't use it since we keep custom JWT)
  // Set to false to disable if we don't want to conflict with our custom system
  emailAndPassword: {
    enabled: false, // Disable since we're using custom JWT for email/password
  },
  // Configure session settings
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    // We might not use better-auth sessions directly if keeping custom JWT
    // but keeping it enabled for OAuth flow
  },
  // Enable account linking if needed
  account: {
    // Account linking settings
  },
});

// Export the auth instance for use in API routes
export default auth;