import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins/generic-oauth";

let _auth: any = null;

function createAuth() {
  // Dynamic import to avoid build-time DB access
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { db } = require("@/db");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { users } = require("@/db/schema");

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          password: users.passwordHash,
        },
      }
    }),
    plugins: [
      genericOAuth({
        config: [
          {
            providerId: "google",
            name: "Google",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
            tokenUrl: "https://oauth2.googleapis.com/token",
            userInfoUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
            scopes: ["openid", "email", "profile"],
            accountSubject: (context: any) => {
              const sub = context.profile.sub ?? context.profile.id;
              return Promise.resolve(sub as string | number);
            },
          },
          {
            providerId: "facebook",
            name: "Facebook",
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
            authorizationUrl: "https://www.facebook.com/v18.0/dialog/oauth",
            tokenUrl: "https://graph.facebook.com/v18.0/oauth/access_token",
            userInfoUrl: "https://graph.facebook.com/me?fields=id,name,email,picture",
            scopes: ["email", "public_profile"],
            accountSubject: (context: any) => {
              const id = context.profile.id;
              return Promise.resolve(id as string | number);
            },
          },
          {
            providerId: "instagram",
            name: "Instagram",
            clientId: process.env.INSTAGRAM_CLIENT_ID as string,
            clientSecret: process.env.INSTAGRAM_CLIENT_SECRET as string,
            authorizationUrl: "https://api.instagram.com/oauth/authorize",
            tokenUrl: "https://api.instagram.com/oauth/access_token",
            scopes: ["user_profile", "user_media"],
            accountSubject: (context: any) => {
              const id = context.profile.id;
              return Promise.resolve(id as string | number);
            },
            getUserInfo: async (tokens: any) => {
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
    emailAndPassword: {
      enabled: false,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30,
    },
    account: {},
  });
}

// Lazy getter — never runs at import/build time
export function getAuth() {
  if (!_auth) {
    _auth = createAuth();
  }
  return _auth;
}

// Proxy so `import auth from "@/lib/better-auth"` still works at runtime
const authProxy = new Proxy({} as ReturnType<typeof betterAuth>, {
  get(_, prop) {
    return (getAuth() as any)[prop];
  },
});

export default authProxy;