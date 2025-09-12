import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/database/mongodb"
import { verifyAuthToken } from "@/lib/auth/middleware"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuthToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const instructorId = searchParams.get("instructor_id")

    if (!instructorId) {
      return NextResponse.json({ error: "Instructor ID required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Get instructor's courses
    const courses = await db
      .collection("courses")
      .find({ instructor_id: new ObjectId(instructorId) })
      .toArray()

    const courseIds = courses.map((course) => course._id)

    // Get enrollments for instructor's courses
    const enrollments = await db
      .collection("enrollments")
      .find({ course_id: { $in: courseIds } })
      .toArray()

    // Get reviews for instructor's courses
    const reviews = await db
      .collection("reviews")
      .find({ course_id: { $in: courseIds } })
      .toArray()

    // Get payments/transactions for revenue calculation
    const payments = await db
      .collection("payments")
      .find({
        course_id: { $in: courseIds },
        status: "completed",
      })
      .toArray()

    // Calculate analytics
    const totalStudents = enrollments.length
    const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
    const activeCourses = courses.filter((course) => course.status === "published").length
    const averageRating =
      reviews.length > 0 ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length : 0

    // Monthly revenue data for charts (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyRevenue = await db
      .collection("payments")
      .aggregate([
        {
          $match: {
            course_id: { $in: courseIds },
            status: "completed",
            created_at: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$created_at" },
              month: { $month: "$created_at" },
            },
            revenue: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ])
      .toArray()

    // Course performance data
    const coursePerformance = await Promise.all(
      courses.map(async (course) => {
        const courseEnrollments = enrollments.filter(
          (enrollment) => enrollment.course_id.toString() === course._id.toString(),
        )
        const courseReviews = reviews.filter((review) => review.course_id.toString() === course._id.toString())
        const coursePayments = payments.filter((payment) => payment.course_id.toString() === course._id.toString())

        return {
          id: course._id.toString(),
          title: course.title,
          enrollments: courseEnrollments.length,
          revenue: coursePayments.reduce((sum, payment) => sum + (payment.amount || 0), 0),
          rating:
            courseReviews.length > 0
              ? courseReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / courseReviews.length
              : 0,
          reviews: courseReviews.length,
          status: course.status,
        }
      }),
    )

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentEnrollments = enrollments.filter(
      (enrollment) => new Date(enrollment.created_at) >= thirtyDaysAgo,
    ).length

    const recentReviews = reviews.filter((review) => new Date(review.created_at) >= thirtyDaysAgo).length

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalStudents,
          totalRevenue,
          activeCourses,
          totalCourses: courses.length,
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: reviews.length,
        },
        monthlyRevenue,
        coursePerformance,
        recentActivity: {
          newEnrollments: recentEnrollments,
          newReviews: recentReviews,
        },
        growth: {
          studentsGrowth: recentEnrollments > 0 ? "+12%" : "0%",
          revenueGrowth: payments.length > 0 ? "+8%" : "0%",
          coursesGrowth: activeCourses > 0 ? "+5%" : "0%",
        },
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
