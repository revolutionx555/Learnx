import { type NextRequest, NextResponse } from "next/server"
import { enrollmentOperations } from "@/lib/database/mongodb"
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

    const { courseId } = await request.json()

    const existingEnrollment = await enrollmentOperations.findByUserAndCourse(payload.userId, courseId)
    if (existingEnrollment) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 400 })
    }

    const enrollment = await enrollmentOperations.create({
      user_id: payload.userId,
      course_id: courseId,
    })

    return NextResponse.json({
      ...enrollment,
      id: enrollment._id.toString(),
      user_id: enrollment.user_id.toString(),
      course_id: enrollment.course_id.toString(),
    })
  } catch (error) {
    console.error("Error creating enrollment:", error)
    return NextResponse.json({ error: "Failed to enroll" }, { status: 500 })
  }
}
