import { type NextRequest, NextResponse } from "next/server"
import { courseOperations, userOperations, lessonOperations } from "@/lib/database/mongodb"
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

    // Get instructor details
    const instructor = await userOperations.findById(course.instructor_id.toString())

    // Get course lessons
    const lessons = await lessonOperations.findByCourse(courseId)

    return NextResponse.json({
      data: {
        ...course,
        id: course._id.toString(),
        instructor_id: course.instructor_id.toString(),
        instructor_name: instructor?.name || "Unknown",
        instructor_email: instructor?.email || "",
        instructor_avatar: instructor?.avatar_url || null,
        lessons: lessons.map((lesson) => ({
          ...lesson,
          id: lesson._id.toString(),
          course_id: lesson.course_id.toString(),
        })),
      },
    })
  } catch (error) {
    console.error("Error fetching instructor course:", error)
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const updateData = await request.json()
    await courseOperations.updateById(courseId, updateData)

    const updatedCourse = await courseOperations.findById(courseId)

    return NextResponse.json({
      data: {
        ...updatedCourse,
        id: updatedCourse._id.toString(),
        instructor_id: updatedCourse.instructor_id.toString(),
      },
    })
  } catch (error) {
    console.error("Error updating course:", error)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    await courseOperations.deleteById(courseId)

    return NextResponse.json({ message: "Course deleted successfully" })
  } catch (error) {
    console.error("Error deleting course:", error)
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}
