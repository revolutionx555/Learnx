// Environment variables validation and types
export const env = {
  // Database - Updated for local development
  DATABASE_URL: process.env.DATABASE_URL || "mongodb+srv://vercel-admin-user:I8OQ7dapFYE8kTnb@learnx.fyz9bq8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://vercel-admin-user:I8OQ7dapFYE8kTnb@learnx.fyz9bq8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  MONGODB_DB: process.env.MONGODB_DB || "learnx",

  // Authentication - Using secure defaults for local development
  JWT_SECRET: process.env.JWT_SECRET || "4300451eeb399483e278787858861d6fed4d5d98",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // External APIs - Optional for local development
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "sk_test_mock_key_for_local_development",
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_mock_key_for_local_development",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "", // Added for production
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "", // Added for production
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  VIMEO_ACCESS_TOKEN: process.env.VIMEO_ACCESS_TOKEN || "",

  MUX_TOKEN_ID: process.env.MUX_TOKEN_ID || "6094a47c-fa7f-46d9-afb3-831c9480974b",
  MUX_TOKEN_SECRET: process.env.MUX_TOKEN_SECRET || "kMI5j2yQCkcbFy3Im5ZS2xG0DMACzBRILyhqe9ae6Yvu23Xfs2GE+/b/OKaUoV2WeShyy/uSKvI",
  MUX_WEBHOOK_SECRET: process.env.MUX_WEBHOOK_SECRET || "",

  // File Storage - Mock values for local development
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "mock_access_key",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "mock_secret_key",
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || "mock-bucket",
  AWS_REGION: process.env.AWS_REGION || "us-east-1",
  
  RESEND_API_KEY: process.env.RESEND_API_KEY || "re_V8SU3DpC_QaUAVAFfFLrPGrRhn21sQ425",

  // App Configuration
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
} as const

export function validateEnv() {
  // Production environment variables - all required for live deployment
  const productionRequired = [
    "DATABASE_URL",
    "JWT_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "MUX_TOKEN_ID",
    "MUX_TOKEN_SECRET",
  ]

  // Development can work with defaults
  const isDevelopment = process.env.NODE_ENV === "development"

  if (!isDevelopment) {
    const missing = productionRequired.filter((key) => !process.env[key])
    if (missing.length > 0) {
      throw new Error(`Missing required production environment variables: ${missing.join(", ")}`)
    }
  }

  console.log(`✅ Environment validation passed - running in ${isDevelopment ? "development" : "production"} mode`)
}
