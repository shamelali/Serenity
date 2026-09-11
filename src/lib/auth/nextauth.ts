import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import type { JWT } from "next-auth/jwt";
import type { Session, DefaultSession } from "next-auth";
import type { Provider } from "next-auth/providers";

// Extend the session type to include our custom fields
declare module "next-auth" {
  interface Session {
    accessToken?: string | null;
    user: DefaultSession["user"] & {
      id: string;
      // Add any other custom fields you want to store in the session
    };
  }
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    // Instagram using custom OAuth provider
    {
      id: "instagram",
      name: "Instagram",
      type: "oauth",
      version: "2.0",
      params: {
        scope: "user_profile,user_media",
      },
      accessTokenUrl: "https://api.instagram.com/oauth/access_token",
      authorizationUrl: { url: "https://api.instagram.com/oauth/authorize" },
      profileUrl: "https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}",
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          email: null,
          image: `https://graph.instagram.com/${profile.id}/picture?access_token=${this.accessToken}`,
        };
      },
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    } as Provider,
  ],
  // Since we are using our own auth system for the app, we might want to use NextAuth just for social login
  // and then link the social account to our existing user system.
  // However, for simplicity, we'll let NextAuth manage the session via JWT.
  // We'll set up JWT and then in the callbacks, we can create/link a user in our database.
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: {
      user: any;
      account: any;
      profile: any;
      email: any;
      credentials: any;
    }) {
      // Here we can check if the user exists in our database and create if not.
      // For now, we'll allow sign in for any user.
      return true;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token, user }: { session: Session; token: JWT; user: any }) {
      // Send properties to the client, like access_token and user id from provider
      session.accessToken = token.accessToken ?? null;
      session.user = {
        ...session.user,
        id: token.sub ?? "",
        // We can add more fields from the token if needed
        // For example, if we stored the provider account id in the token
        // providerAccountId: token.providerAccountId,
      };
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }: {
      token: JWT;
      user: any;
      account: any;
      profile: any;
      isNewUser: boolean;
    }) {
      // Persist the OAuth access_token and other info to the token
      if (account) {
        token.accessToken = account.access_token;
        // We can also store the provider and providerAccountId
        token.provider = account.provider;
        // Fix: use a proper variable name
        token.providerAccountId = account.providerAccountId;
      }
      // If we have a user object (from credentials or if we looked up the user in the signIn callback)
      if (user) {
        token.sub = user.id; // Our internal user id
      }
      return token;
    },
  },
  // We can set up pages if we want to override the default NextAuth pages
  pages: {
    signIn: '/auth/signin', // We'll create this page if needed
    error: '/auth/error',
  },
  // We need to set a secret for JWT
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);