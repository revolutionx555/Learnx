import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/database/mongodb"
import { verifyAuthToken } from "@/lib/auth/middleware"

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuthToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const instructorId = searchParams.get("instructor_id")

    if (!instructorId) {
      return NextResponse.json({ error: "Instructor ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Get all courses by this instructor
    const instructorCourses = await db.collection("courses").find({ instructor_id: instructorId }).toArray()

    const courseIds = instructorCourses.map((course) => course._id.toString())

    // Get all enrollments for instructor's courses
    const enrollments = await db
      .collection("enrollments")
      .find({ course_id: { $in: courseIds } })
      .toArray()

    // Get unique student IDs
    const studentIds = [...new Set(enrollments.map((e) => e.student_id))]

    // Get student details
    const students = await db
      .collection("users")
      .find({
        _id: { $in: studentIds.map((id) => ({ $oid: id })) },
        role: "student",
      })
      .toArray()

    // Aggregate student data with course progress
    const studentsWithProgress = await Promise.all(
      students.map(async (student) => {
        const studentEnrollments = enrollments.filter((e) => e.student_id === student._id.toString())

        // Get progress for each course
        const courseProgress = await Promise.all(
          studentEnrollments.map(async (enrollment) => {
            const course = instructorCourses.find((c) => c._id.toString() === enrollment.course_id)

            // Calculate progress based on completed lessons
            const completedLessons = await db.collection("lesson_progress").countDocuments({
              student_id: student._id.toString(),
              course_id: enrollment.course_id,
              completed: true,
            })

            const totalLessons = await db.collection("lessons").countDocuments({ course_id: enrollment.course_id })

            const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

            return {
              id: course?._id.toString(),
              title: course?.title || "Unknown Course",
              progress,
              enrollment_date: enrollment.enrollment_date,
              completion_date: enrollment.completion_date,
              status: progress === 100 ? "completed" : progress > 0 ? "in_progress" : "not_started",
            }
          }),
        )

        const totalCourses = courseProgress.length
        const completedCourses = courseProgress.filter((c) => c.status === "completed").length
        const averageProgress =
          totalCourses > 0 ? Math.round(courseProgress.reduce((sum, c) => sum + c.progress, 0) / totalCourses) : 0

        // Get last activity
        const lastActivity = await db
          .collection("lesson_progress")
          .findOne({ student_id: student._id.toString() }, { sort: { updated_at: -1 } })

        return {
          id: student._id.toString(),
          name: student.name || `${student.first_name || ""} ${student.last_name || ""}`.trim(),
          email: student.email,
          avatar_url: student.avatar_url,
          enrollment_date: Math.min(...studentEnrollments.map((e) => new Date(e.enrollment_date).getTime())),
          total_courses: totalCourses,
          completed_courses: completedCourses,
          progress_percentage: averageProgress,
          last_activity: lastActivity?.updated_at || studentEnrollments[0]?.enrollment_date,
          status:
            lastActivity && new Date(lastActivity.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ? "active"
              : "inactive",
          courses: courseProgress,
        }
      }),
    )

    return NextResponse.json({
      success: true,
      students: studentsWithProgress,
      total: studentsWithProgress.length,
    })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
