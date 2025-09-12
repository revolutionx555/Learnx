import { type NextRequest, NextResponse } from "next/server"
import { userOperations } from "@/lib/database/mongodb"
import { verifyPassword } from "@/lib/auth/password"
import { signToken, generateRefreshToken } from "@/lib/auth/jwt"
import type { LoginRequest } from "@/lib/types/api"

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const user = await userOperations.findByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json({ error: "Account is deactivated" }, { status: 401 })
    }

    // Generate tokens
    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    })
    const refresh_token = generateRefreshToken(user._id.toString())

    // Remove password hash from response
    const { password_hash: _, ...userResponse } = user

    return NextResponse.json({
      success: true,
      data: {
        user: {
          ...userResponse,
          id: user._id.toString(),
        },
        token,
        refresh_token,
      },
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
