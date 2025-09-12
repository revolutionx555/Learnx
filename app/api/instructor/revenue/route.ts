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

    // Get enrollments for revenue calculation
    const enrollments = await db
      .collection("enrollments")
      .find({
        courseId: { $in: courseIds },
      })
      .toArray()

    // Get transactions
    const transactions = await db
      .collection("transactions")
      .find({
        courseId: { $in: courseIds },
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

    // Calculate revenue metrics
    const totalRevenue = transactions.filter((t) => t.type === "purchase").reduce((sum, t) => sum + t.amount, 0)

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const monthlyRevenue = transactions
      .filter((t) => {
        const transactionDate = new Date(t.createdAt)
        return (
          t.type === "purchase" &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        )
      })
      .reduce((sum, t) => sum + t.amount, 0)

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const lastMonthRevenue = transactions
      .filter((t) => {
        const transactionDate = new Date(t.createdAt)
        return (
          t.type === "purchase" &&
          transactionDate.getMonth() === lastMonth &&
          transactionDate.getFullYear() === lastMonthYear
        )
      })
      .reduce((sum, t) => sum + t.amount, 0)

    const revenueGrowth = lastMonthRevenue > 0 ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

    // Generate monthly data for the last 12 months
    const monthlyData = []
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const month = date.toLocaleDateString("en-US", { month: "short" })

      const monthRevenue = transactions
        .filter((t) => {
          const transactionDate = new Date(t.createdAt)
          return (
            t.type === "purchase" &&
            transactionDate.getMonth() === date.getMonth() &&
            transactionDate.getFullYear() === date.getFullYear()
          )
        })
        .reduce((sum, t) => sum + t.amount, 0)

      monthlyData.push({ month, revenue: monthRevenue })
    }

    // Course revenue breakdown
    const courseRevenue = courses.map((course) => {
      const courseTransactions = transactions.filter(
        (t) => t.courseId.toString() === course._id.toString() && t.type === "purchase",
      )
      const courseEnrollments = enrollments.filter((e) => e.courseId.toString() === course._id.toString())

      return {
        name: course.title,
        revenue: courseTransactions.reduce((sum, t) => sum + t.amount, 0),
        enrollments: courseEnrollments.length,
        price: course.price || 0,
      }
    })

    // Format transactions for display
    const formattedTransactions = await Promise.all(
      transactions.slice(0, 20).map(async (transaction) => {
        const course = courses.find((c) => c._id.toString() === transaction.courseId.toString())
        const student = await db.collection("users").findOne({ _id: transaction.userId })

        return {
          courseName: course?.title || "Unknown Course",
          studentName: student?.name || "Unknown Student",
          amount: transaction.amount,
          type: transaction.type,
          date: transaction.createdAt,
        }
      }),
    )

    // Mock payout history (in a real app, this would come from payment processor)
    const payoutHistory = [
      {
        id: "PO001",
        amount: Math.floor(totalRevenue * 0.3),
        status: "completed",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: "PO002",
        amount: Math.floor(totalRevenue * 0.2),
        status: "pending",
        date: new Date(),
      },
    ]

    return NextResponse.json({
      totalRevenue,
      monthlyRevenue,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      monthlyData,
      courseRevenue,
      transactions: formattedTransactions,
      payoutHistory,
    })
  } catch (error) {
    console.error("Error fetching revenue data:", error)
    return NextResponse.json({ error: "Failed to fetch revenue data" }, { status: 500 })
  }
}
