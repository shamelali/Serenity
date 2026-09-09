export const config = {
  app: {
    name: "Serenity",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  },
  currency: {
    code: "MYR",
    locale: "ms-MY",
    symbol: "RM",
  },
  location: {
    defaultLat: 3.139,
    defaultLon: 101.6869,
    defaultCity: "Kuala Lumpur",
  },
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 50,
  },
  image: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    uploadPath: "providers",
  },
  cache: {
    staticMaxAge: 31536000,
    dynamicMaxAge: 60,
  },
  rateLimit: {
    windowMs: 60 * 1000,
    maxRequests: 100,
  },
} as const;

export type Config = typeof config;