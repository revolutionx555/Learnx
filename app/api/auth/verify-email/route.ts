import { type NextRequest, NextResponse } from "next/server"
import { signToken, generateRefreshToken } from "@/lib/auth/jwt"
import { connectToDatabase } from "@/lib/database/mongodb"
import { verifyToken } from "@/lib/auth/verification"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    const tokenResult = await verifyToken(token, "email_verification")
    if (!tokenResult.success) {
      return NextResponse.json({ error: tokenResult.error }, { status: 400 })
    }

    const db = await connectToDatabase()

    const user = await db.collection("users").findOne({ email: tokenResult.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.is_verified) {
      return NextResponse.json({ error: "Email already verified" }, { status: 400 })
    }

    await db.collection("users").updateOne(
      { email: tokenResult.email },
      {
        $set: {
          is_verified: true,
          is_active: true,
          verified_at: new Date(),
          updated_at: new Date(),
        },
      },
    )

    const authToken = signToken({
      id: user.id,
      email: user.email,
      role: user.role as "student" | "instructor",
    })
    const refresh_token = generateRefreshToken(user.id)

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now access your account.",
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          is_verified: true,
          is_active: true,
        },
        token: authToken,
        refresh_token,
      },
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
