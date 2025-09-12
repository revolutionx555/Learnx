import { type NextRequest, NextResponse } from "next/server"
import { validatePassword, hashPassword } from "@/lib/auth/password"
import { connectToDatabase } from "@/lib/database/mongodb"
import { generateVerificationToken, storeVerificationToken } from "@/lib/auth/verification"
import { sendWelcomeEmail } from "@/lib/email/resend"
import { appConfig } from "@/lib/config/environment"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, first_name, last_name } = body

    // Validate input
    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: "Password validation failed", details: passwordValidation.errors },
        { status: 400 },
      )
    }

    const db = await connectToDatabase()

    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)
    const userId = crypto.randomUUID()

    await db.collection("users").insertOne({
      id: userId,
      email,
      password_hash: hashedPassword,
      first_name,
      last_name,
      role: "student",
      is_verified: false,
      is_active: false,
      created_at: new Date(),
      updated_at: new Date(),
    })

    const verificationToken = generateVerificationToken()
    await storeVerificationToken(email, verificationToken, "email_verification", 24)

    const verificationUrl = `${appConfig.url}/auth/verify-email?token=${verificationToken}`
    await sendWelcomeEmail(email, {
      firstName: first_name,
      verificationUrl,
    })

    return NextResponse.json({
      success: true,
      message: "Account created! Please check your email to verify your account.",
      data: {
        email,
        verification_required: true,
      },
    })
  } catch (error) {
    console.error("Student signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
