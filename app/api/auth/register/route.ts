import { type NextRequest, NextResponse } from "next/server"
import { userOperations } from "@/lib/database/mongodb"
import { hashPassword, validatePassword } from "@/lib/auth/password"
import { signToken, generateRefreshToken } from "@/lib/auth/jwt"

interface RegisterRequest {
  email: string
  password: string
  name: string
  role?: "student" | "instructor"
}

export async function POST(request: NextRequest) {
  try {
    console.log("Registration attempt started...")

    const body: RegisterRequest = await request.json()
    const { email, password, name, role = "student" } = body

    console.log("Registration data:", { email, name, role })

    // Validate input
    if (!email || !password || !name) {
      console.log("Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("Invalid email format")
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      console.log("Password validation failed:", passwordValidation.errors)
      return NextResponse.json(
        { error: "Password validation failed", details: passwordValidation.errors },
        { status: 400 },
      )
    }

    console.log("Checking if user exists...")

    // Check if user already exists
    const existingUser = await userOperations.findByEmail(email)
    if (existingUser) {
      console.log("User already exists")
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 })
    }

    console.log("Hashing password...")

    // Hash password
    const password_hash = await hashPassword(password)

    console.log("Creating user in database...")

    // Create user
    const newUser = await userOperations.create({
      email,
      password_hash,
      name,
      role,
    })

    console.log("User created successfully:", newUser._id)

    // Generate tokens
    const token = signToken({
      id: newUser._id.toString(),
      email: newUser.email,
      role: role as "student" | "instructor",
    })
    const refresh_token = generateRefreshToken(newUser._id.toString())

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: newUser._id.toString(),
          _id: newUser._id.toString(),
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          email_verified: newUser.email_verified,
          created_at: newUser.created_at,
        },
        token,
        refresh_token,
      },
      message: "User registered successfully",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
