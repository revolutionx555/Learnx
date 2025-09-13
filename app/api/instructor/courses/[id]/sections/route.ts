import { type NextRequest, NextResponse } from "next/server"
import { lessonOperations, courseOperations } from "@/lib/database/mongodb"
import { verifyToken } from "@/lib/auth/jwt"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const courseId = params.id
    const course = await courseOperations.findById(courseId)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    if (course.instructor_id.toString() !== payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get course lessons organized as sections
    const lessons = await lessonOperations.findByCourse(courseId)

    // This can be enhanced later to support multiple sections
    const sections = [
      {
        id: "default-section",
        title: "Course Content",
        lessons: lessons.map((lesson) => ({
          ...lesson,
          id: lesson._id.toString(),
          course_id: lesson.course_id.toString(),
        })),
      },
    ]

    return NextResponse.json({
      data: sections,
    })
  } catch (error) {
    console.error("Error fetching course sections:", error)
    return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 })
  }
}
