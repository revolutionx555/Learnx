// Environment configuration and validation
export const env = {
  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || "",
  MONGODB_DB: process.env.MONGODB_DB || "learnx",

  // Authentication
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // Email
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",

  // Video Services
  MUX_TOKEN_ID: process.env.MUX_TOKEN_ID || "",
  MUX_TOKEN_SECRET: process.env.MUX_TOKEN_SECRET || "",
  MUX_WEBHOOK_SECRET: process.env.MUX_WEBHOOK_SECRET || "",
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || "",

  // Payments
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",

  // Application
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Learn X",

  // Node Environment
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
}

// Environment validation
export function validateEnvironment() {
  const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"]

  const missingVars = requiredEnvVars.filter((varName) => !env[varName as keyof typeof env])

  if (missingVars.length > 0) {
    console.warn("Missing required environment variables:", missingVars)
    if (env.IS_PRODUCTION) {
      throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`)
    }
  }

  return {
    isValid: missingVars.length === 0,
    missingVars,
  }
}

// Feature flags based on environment variables
export const features = {
  database: {
    enabled: !!env.MONGODB_URI,
  },
  email: {
    enabled: !!env.RESEND_API_KEY,
  },
  video: {
    mux: !!(env.MUX_TOKEN_ID && env.MUX_TOKEN_SECRET),
    youtube: !!env.YOUTUBE_API_KEY,
  },
  payments: {
    stripe: !!(env.STRIPE_SECRET_KEY && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
  },
}

// Configuration objects for services
export const mongoConfig = {
  uri: env.MONGODB_URI,
  dbName: env.MONGODB_DB,
}

export const authConfig = {
  secret: env.NEXTAUTH_SECRET,
  url: env.NEXTAUTH_URL,
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
}

export const emailConfig = {
  apiKey: env.RESEND_API_KEY,
  fromEmail: "noreply@learnx.com",
  fromName: env.NEXT_PUBLIC_APP_NAME,
}

export const videoConfig = {
  mux: {
    tokenId: env.MUX_TOKEN_ID,
    tokenSecret: env.MUX_TOKEN_SECRET,
    webhookSecret: env.MUX_WEBHOOK_SECRET,
  },
  youtube: {
    apiKey: env.YOUTUBE_API_KEY,
  },
}

export const stripeConfig = {
  secretKey: env.STRIPE_SECRET_KEY,
  publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  webhookSecret: env.STRIPE_WEBHOOK_SECRET,
}

export const appConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  url: env.NEXT_PUBLIC_APP_URL,
  description: "Professional learning management system for instructors and students",
  version: "1.0.0",
}
