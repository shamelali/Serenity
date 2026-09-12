import betterAuth from "@/lib/better-auth";

// Create a wrapper function to avoid direct import issues
const createNextJsHandler = (authInstance: any) => {
  // Dynamically require the Next.js integration
  // @ts-ignore
  const nextJsIntegration = require("better-auth/integrations/next-js");
  return nextJsIntegration.toNextJsHandler(authInstance);
};

// Create the better-auth instance (already exported from ./lib/better-auth)
// Wrap it with the Next.js handler
const { GET, POST, PATCH, PUT, DELETE, ...rest } = createNextJsHandler(betterAuth);

// Export the HTTP methods for Next.js App Router
export { GET, POST, PATCH, PUT, DELETE };

// Also export the auth object if needed for other usage
export default betterAuth;
