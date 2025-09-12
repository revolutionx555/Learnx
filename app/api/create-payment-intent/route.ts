import { type NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { db } from "@/lib/database"
import { verifyToken } from "@/lib/auth/jwt"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { courseId, amount, currency = "usd" } = await request.json()

    // Get course details
    const course = await db.query("SELECT * FROM courses WHERE id = $1", [courseId])
    if (course.rows.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Check if user is already enrolled
    const enrollment = await db.query("SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2", [
      payload.userId,
      courseId,
    ])

    if (enrollment.rows.length > 0) {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 400 })
    }

    // Get user details
    const user = await db.query("SELECT * FROM users WHERE id = $1", [payload.userId])
    if (user.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const stripe = getStripe()

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        courseId,
        userId: payload.userId,
        userEmail: user.rows[0].email,
        courseName: course.rows[0].title,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
