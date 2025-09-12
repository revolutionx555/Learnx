import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { enrollmentOperations, courseOperations, userOperations, progressOperations } from "@/lib/database/mongodb"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const enrollments = await enrollmentOperations.findByUser(payload.userId)

    const enrichedEnrollments = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = await courseOperations.findById(enrollment.course_id.toString())
        const instructor = course ? await userOperations.findById(course.instructor_id.toString()) : null
        const userProgress = await progressOperations.findByUser(payload.userId)

        // Calculate progress for this course
        const courseProgress = userProgress.filter(
          (p) => course && course._id.toString() === enrollment.course_id.toString(),
        )

        return {
          id: course?._id.toString(),
          title: course?.title || "Unknown Course",
          description: course?.description || "",
          thumbnail_url: course?.thumbnail_url || "",
          category: course?.category || "",
          difficulty_level: course?.difficulty || "beginner",
          average_rating: 0, // TODO: Calculate from reviews
          instructor_name: instructor?.name || "Unknown",
          instructor_avatar: instructor?.avatar_url || "",
          progress_percentage: enrollment.progress || 0,
          last_accessed_at: enrollment.updated_at,
          total_lessons: 0, // TODO: Count lessons
          completed_lessons: courseProgress.filter((p) => p.completed).length,
          time_spent_minutes: 0, // TODO: Calculate time spent
        }
      }),
    )

    return NextResponse.json(enrichedEnrollments)
  } catch (error) {
    console.error("Error fetching student enrollments:", error)
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
  }
}
