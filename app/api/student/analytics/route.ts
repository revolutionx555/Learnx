import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { queryOne, queryMany } from "@/lib/database/connection"

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

    // Get basic stats
    const basicStats = await queryOne<any>(
      `
      SELECT 
        COUNT(DISTINCT e.course_id) as total_courses_enrolled,
        COUNT(DISTINCT CASE WHEN e.completed_at IS NOT NULL THEN e.course_id END) as total_courses_completed,
        COUNT(DISTINCT cert.id) as total_certificates,
        COALESCE(SUM(lp.time_spent_minutes), 0) as total_time_spent_minutes
      FROM enrollments e
      LEFT JOIN certificates cert ON e.user_id = cert.user_id AND e.course_id = cert.course_id
      LEFT JOIN lessons l ON l.course_id = e.course_id
      LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = e.user_id
      WHERE e.user_id = $1
    `,
      [payload.userId],
    )

    // Get favorite categories
    const favoriteCategories = await queryMany<any>(
      `
      SELECT 
        c.category,
        COUNT(*) as course_count
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = $1 AND c.category IS NOT NULL
      GROUP BY c.category
      ORDER BY course_count DESC
      LIMIT 5
    `,
      [payload.userId],
    )

    // Calculate learning streak (simplified - last 7 days with activity)
    const recentActivity = await queryOne<any>(
      `
      SELECT COUNT(DISTINCT DATE(lp.updated_at)) as active_days
      FROM lesson_progress lp
      JOIN lessons l ON lp.lesson_id = l.id
      WHERE lp.user_id = $1 
        AND lp.updated_at >= NOW() - INTERVAL '7 days'
    `,
      [payload.userId],
    )

    const analytics = {
      total_courses_enrolled: Number.parseInt(basicStats?.total_courses_enrolled || "0"),
      total_courses_completed: Number.parseInt(basicStats?.total_courses_completed || "0"),
      total_certificates: Number.parseInt(basicStats?.total_certificates || "0"),
      total_time_spent_minutes: Number.parseInt(basicStats?.total_time_spent_minutes || "0"),
      learning_streak_days: Number.parseInt(recentActivity?.active_days || "0"),
      favorite_categories: favoriteCategories || [],
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching student analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
