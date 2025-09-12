import { type NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth/middleware"
import { connectToDatabase } from "@/lib/database/mongodb"

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuthToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const instructorId = authResult.user.id

    // Get all courses by instructor
    const courses = await db
      .collection("courses")
      .find({
        instructorId,
        status: "published",
      })
      .toArray()

    const courseIds = courses.map((course) => course._id)

    // Get enrollments and progress data
    const enrollments = await db
      .collection("enrollments")
      .find({
        courseId: { $in: courseIds },
      })
      .toArray()

    const progress = await db
      .collection("progress")
      .find({
        courseId: { $in: courseIds },
      })
      .toArray()

    // Calculate overview metrics
    const totalViews = progress.reduce((sum, p) => sum + (p.videoViews || 0), 0)
    const completedCourses = progress.filter((p) => p.completionPercentage === 100).length
    const completionRate = enrollments.length > 0 ? Math.round((completedCourses / enrollments.length) * 100) : 0

    // Calculate average rating
    const ratings = await db
      .collection("reviews")
      .find({
        courseId: { $in: courseIds },
      })
      .toArray()
    const avgRating =
      ratings.length > 0 ? Math.round((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length) * 10) / 10 : 0

    // Active students (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const activeStudents = await db.collection("progress").distinct("userId", {
      courseId: { $in: courseIds },
      lastAccessed: { $gte: thirtyDaysAgo },
    })

    // Course performance data
    const coursePerformance = await Promise.all(
      courses.map(async (course) => {
        const courseEnrollments = enrollments.filter((e) => e.courseId.toString() === course._id.toString())
        const courseProgress = progress.filter((p) => p.courseId.toString() === course._id.toString())
        const courseRatings = ratings.filter((r) => r.courseId.toString() === course._id.toString())

        const completed = courseProgress.filter((p) => p.completionPercentage === 100).length
        const courseCompletionRate =
          courseEnrollments.length > 0 ? Math.round((completed / courseEnrollments.length) * 100) : 0

        const courseAvgRating =
          courseRatings.length > 0
            ? Math.round((courseRatings.reduce((sum, r) => sum + r.rating, 0) / courseRatings.length) * 10) / 10
            : 0

        return {
          title: course.title,
          enrollments: courseEnrollments.length,
          completionRate: courseCompletionRate,
          avgRating: courseAvgRating,
        }
      }),
    )

    // Generate completion rates data for chart
    const completionRates = courses.map((course) => {
      const courseEnrollments = enrollments.filter((e) => e.courseId.toString() === course._id.toString())
      const courseProgress = progress.filter((p) => p.courseId.toString() === course._id.toString())
      const completed = courseProgress.filter((p) => p.completionPercentage === 100).length
      const completionRate = courseEnrollments.length > 0 ? Math.round((completed / courseEnrollments.length) * 100) : 0

      return {
        courseName: course.title.length > 15 ? course.title.substring(0, 15) + "..." : course.title,
        completionRate,
      }
    })

    // Generate student activity data (mock hourly data)
    const studentActivity = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      activeStudents: Math.floor(Math.random() * 50) + 10,
    }))

    // Engagement metrics (mock data based on real patterns)
    const engagementMetrics = [
      { metric: "Video Completion", score: 75 },
      { metric: "Quiz Participation", score: 68 },
      { metric: "Discussion Posts", score: 45 },
      { metric: "Assignment Submission", score: 82 },
      { metric: "Course Rating", score: avgRating * 20 },
      { metric: "Return Rate", score: 60 },
    ]

    // Time spent data (weekly)
    const timeSpentData = Array.from({ length: 12 }, (_, week) => ({
      week: `Week ${week + 1}`,
      hours: Math.floor(Math.random() * 20) + 15,
    }))

    // Device statistics
    const deviceStats = [
      { name: "Desktop", percentage: 45 },
      { name: "Mobile", percentage: 35 },
      { name: "Tablet", percentage: 20 },
    ]

    // Popular content (mock data)
    const popularContent = [
      {
        title: "Introduction to React Hooks",
        course: "React Masterclass",
        views: 1250,
        completionRate: 89,
        avgTimeSpent: 25,
      },
      {
        title: "State Management with Redux",
        course: "React Masterclass",
        views: 980,
        completionRate: 76,
        avgTimeSpent: 32,
      },
      {
        title: "Building REST APIs",
        course: "Node.js Complete Guide",
        views: 875,
        completionRate: 82,
        avgTimeSpent: 28,
      },
    ]

    return NextResponse.json({
      overview: {
        totalViews,
        completionRate,
        avgRating,
        activeStudents: activeStudents.length,
      },
      coursePerformance,
      studentActivity,
      engagementMetrics,
      completionRates,
      popularContent,
      timeSpentData,
      deviceStats,
    })
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}
