import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { queryMany, queryOne } from "@/lib/database/connection"

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

    // Check if user is instructor
    const user = await queryOne<any>("SELECT role FROM users_sync WHERE id = $1", [payload.userId])
    if (!user || user.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30" // days
    const courseId = searchParams.get("courseId")

    let whereClause = "WHERE c.instructor_id = $1 AND t.created_at >= NOW() - INTERVAL $2 DAY"
    const params: any[] = [payload.userId, period]

    if (courseId) {
      whereClause += " AND t.course_id = $3"
      params.push(courseId)
    }

    // Revenue analytics
    const revenueData = await queryOne<any>(
      `
      SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN t.status = 'completed' THEN t.amount ELSE 0 END) as total_revenue,
        SUM(CASE WHEN t.status = 'refunded' THEN t.amount ELSE 0 END) as total_refunds,
        AVG(CASE WHEN t.status = 'completed' THEN t.amount ELSE NULL END) as avg_transaction_value
      FROM transactions t
      JOIN courses c ON t.course_id = c.id
      ${whereClause}
    `,
      params,
    )

    // Daily revenue trend
    const revenueTrend = await queryMany<any>(
      `
      SELECT 
        DATE(t.created_at) as date,
        SUM(CASE WHEN t.status = 'completed' THEN t.amount ELSE 0 END) as revenue,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as transactions
      FROM transactions t
      JOIN courses c ON t.course_id = c.id
      ${whereClause}
      GROUP BY DATE(t.created_at)
      ORDER BY date DESC
      LIMIT 30
    `,
      params,
    )

    // Top performing courses
    const topCourses = await queryMany<any>(
      `
      SELECT 
        c.id,
        c.title,
        COUNT(t.id) as total_sales,
        SUM(CASE WHEN t.status = 'completed' THEN t.amount ELSE 0 END) as revenue
      FROM courses c
      LEFT JOIN transactions t ON c.id = t.course_id AND t.created_at >= NOW() - INTERVAL $2 DAY
      WHERE c.instructor_id = $1
      GROUP BY c.id, c.title
      ORDER BY revenue DESC
      LIMIT 10
    `,
      [payload.userId, period],
    )

    // Payment method breakdown
    const paymentMethods = await queryMany<any>(
      `
      SELECT 
        'card' as method,
        COUNT(*) as count,
        SUM(CASE WHEN t.status = 'completed' THEN t.amount ELSE 0 END) as revenue
      FROM transactions t
      JOIN courses c ON t.course_id = c.id
      ${whereClause}
      GROUP BY method
    `,
      params,
    )

    return NextResponse.json({
      summary: {
        total_transactions: Number.parseInt(revenueData?.total_transactions || "0"),
        total_revenue: Number.parseFloat(revenueData?.total_revenue || "0"),
        total_refunds: Number.parseFloat(revenueData?.total_refunds || "0"),
        avg_transaction_value: Number.parseFloat(revenueData?.avg_transaction_value || "0"),
      },
      revenue_trend: revenueTrend.map((item) => ({
        date: item.date,
        revenue: Number.parseFloat(item.revenue || "0"),
        transactions: Number.parseInt(item.transactions || "0"),
      })),
      top_courses: topCourses.map((course) => ({
        id: course.id,
        title: course.title,
        total_sales: Number.parseInt(course.total_sales || "0"),
        revenue: Number.parseFloat(course.revenue || "0"),
      })),
      payment_methods: paymentMethods.map((method) => ({
        method: method.method,
        count: Number.parseInt(method.count || "0"),
        revenue: Number.parseFloat(method.revenue || "0"),
      })),
    })
  } catch (error) {
    console.error("Error fetching payment analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
