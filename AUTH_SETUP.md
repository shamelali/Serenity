# Environment Variables for Authentication

To enable Google, Facebook, and Instagram authentication, add the following environment variables to your `.env.local` file:

## Google OAuth
- `GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth Client Secret

## Facebook OAuth
- `FACEBOOK_CLIENT_ID` - Your Facebook App ID
- `FACEBOOK_CLIENT_SECRET` - Your Facebook App Secret

## Instagram OAuth (Basic Display API)
- `INSTAGRAM_CLIENT_ID` - Your Instagram App ID (from Facebook Developer Console)
- `INSTAGRAM_CLIENT_SECRET` - Your Instagram App Secret (from Facebook Developer Console)

## NextAuth
- `NEXTAUTH_SECRET` - A random string used to encrypt JWT tokens (generate with `openssl rand -hex 32`)
- `NEXTAUTH_URL` - Your site's URL (e.g., `http://localhost:3000` for development)

## Setup Instructions

### Google
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select existing one
3. Go to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID
5. Set Authorized JavaScript origins to `http://localhost:3000`
6. Set Authorized redirect URIs to `http://localhost:3000/api/auth/callback/google`

### Facebook
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create an app
3. Add Facebook Login product
4. Set Valid OAuth Redirect URIs to `http://localhost:3000/api/auth/callback/facebook`

### Instagram
1. Go to [Facebook Developers](https://developers.facebook.com/) (Instagram is managed via Facebook)
2. Create an app
3. Add Instagram Basic Display API product
4. Set Valid OAuth Redirect URIs to `http://localhost:3000/api/auth/callback/instagram`
5. Note: For production, you'll need to submit for review to get permissions beyond basic scope

## Usage in Components

You can use the `signIn` function from `next-auth/react` to initiate authentication:

```tsx
import { signIn } from "next-auth/react";

// Example button to sign in with Google
<button onClick={() => signIn("google")}>Sign in with Google</button>

// Example button to sign in with Facebook
<button onClick={() => signIn("facebook")}>Sign in with Facebook</button>

// Example button to sign in with Instagram
<button onClick={() => signIn("instagram")}>Sign in with Instagram</button>
```

## Handling the Session

After successful authentication, you can access the session data using the `useSession` hook:

```tsx
import { useSession } from "next-auth/react";

function Profile() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user.name}</p>
        {session.accessToken && <p>Access token available for API calls</p>}
      </div>
    );
  }

  return <p>Not signed in</p>;
}
```

## Notes

- The Instagram implementation uses the Instagram Basic Display API, which provides limited data (username, id, profile picture). For more data (email, etc.), you would need to use the Instagram Graph API which requires additional permissions and app review.
- All OAuth callbacks are handled automatically at `/api/auth/callback/[provider]`.
- You may want to create a custom sign-in page at `/app/auth/signin/page.tsx` to provide a branded login experience.