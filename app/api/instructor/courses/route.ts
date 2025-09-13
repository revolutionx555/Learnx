import { type NextRequest, NextResponse } from "next/server"
import { courseOperations, userOperations } from "@/lib/database/mongodb"
import { verifyToken } from "@/lib/auth/jwt"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const courses = await courseOperations.findByInstructor(payload.userId)

    const coursesWithDetails = await Promise.all(
      courses.map(async (course) => {
        const instructor = await userOperations.findById(course.instructor_id.toString())
        return {
          ...course,
          id: course._id.toString(),
          instructor_id: course.instructor_id.toString(),
          instructor_name: instructor?.name || "Unknown",
          instructor_avatar: instructor?.avatar_url || null,
        }
      }),
    )

    return NextResponse.json({
      data: coursesWithDetails,
    })
  } catch (error) {
    console.error("Error fetching instructor courses:", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}
