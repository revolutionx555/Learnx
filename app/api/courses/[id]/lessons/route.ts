import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { courseOperations, lessonOperations } from "@/lib/database/mongodb"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const courseId = params.id
    const { title, description, video_url, content, duration, order_index, is_free = false } = await request.json()

    const course = await courseOperations.findById(courseId)
    if (!course || course.instructor_id.toString() !== payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const lesson = await lessonOperations.create({
      course_id: courseId,
      title,
      description,
      video_url,
      content,
      duration: duration || 0,
      order_index: order_index || 0,
      is_free,
    })

    return NextResponse.json({
      ...lesson,
      id: lesson._id.toString(),
      course_id: lesson.course_id.toString(),
    })
  } catch (error) {
    console.error("Error creating lesson:", error)
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 })
  }
}
