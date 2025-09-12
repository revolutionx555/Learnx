import crypto from "crypto"
import { connectToDatabase } from "@/lib/database/mongodb"

export interface VerificationToken {
  token: string
  email: string
  type: "email_verification" | "password_reset"
  expires_at: Date
  used: boolean
}

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export async function storeVerificationToken(
  email: string,
  token: string,
  type: "email_verification" | "password_reset",
  expiresInHours = 24,
) {
  try {
    const db = await connectToDatabase()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + expiresInHours)

    await db.collection("verification_tokens").insertOne({
      token,
      email,
      type,
      expires_at: expiresAt,
      used: false,
      created_at: new Date(),
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to store verification token:", error)
    return { success: false, error: "Database error" }
  }
}

export async function verifyToken(token: string, type: "email_verification" | "password_reset") {
  try {
    const db = await connectToDatabase()

    const tokenDoc = await db.collection("verification_tokens").findOne({
      token,
      type,
      used: false,
      expires_at: { $gt: new Date() },
    })

    if (!tokenDoc) {
      return { success: false, error: "Invalid or expired token" }
    }

    // Mark token as used
    await db
      .collection("verification_tokens")
      .updateOne({ _id: tokenDoc._id }, { $set: { used: true, used_at: new Date() } })

    return {
      success: true,
      email: tokenDoc.email,
      token: tokenDoc.token,
    }
  } catch (error) {
    console.error("Token verification failed:", error)
    return { success: false, error: "Database error" }
  }
}

export async function cleanupExpiredTokens() {
  try {
    const db = await connectToDatabase()

    const result = await db.collection("verification_tokens").deleteMany({
      expires_at: { $lt: new Date() },
    })

    console.log(`Cleaned up ${result.deletedCount} expired tokens`)
    return { success: true, deletedCount: result.deletedCount }
  } catch (error) {
    console.error("Token cleanup failed:", error)
    return { success: false, error: "Database error" }
  }
}
