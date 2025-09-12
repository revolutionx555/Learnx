import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { queryOne, query } from "@/lib/database/connection"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { courseId, lessonId } = await request.json()

    // Mark lesson as completed
    await query(
      `INSERT INTO lesson_progress (user_id, lesson_id, completed_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id, lesson_id) DO UPDATE SET completed_at = NOW()`,
      [payload.userId, lessonId],
    )

    // Calculate course progress
    const totalLessons = await queryOne<{ count: number }>(
      `SELECT COUNT(*) as count FROM lessons WHERE course_id = $1`,
      [courseId],
    )

    const completedLessons = await queryOne<{ count: number }>(
      `SELECT COUNT(*) as count 
       FROM lesson_progress lp
       JOIN lessons l ON lp.lesson_id = l.id
       WHERE lp.user_id = $1 AND l.course_id = $2`,
      [payload.userId, courseId],
    )

    const progressPercentage = Math.round((completedLessons!.count / totalLessons!.count) * 100)

    // Update enrollment progress
    await query(
      `UPDATE enrollments 
       SET progress_percentage = $1, last_accessed_at = NOW()
       WHERE user_id = $2 AND course_id = $3`,
      [progressPercentage, payload.userId, courseId],
    )

    if (progressPercentage === 100) {
      // Check if certificate already exists
      const existingCert = await queryOne<any>(`SELECT * FROM certificates WHERE user_id = $1 AND course_id = $2`, [
        payload.userId,
        courseId,
      ])

      if (!existingCert) {
        // Generate certificate automatically
        const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${certificateNumber}`

        await query(
          `INSERT INTO certificates (user_id, course_id, certificate_number, verification_url)
           VALUES ($1, $2, $3, $4)`,
          [payload.userId, courseId, certificateNumber, verificationUrl],
        )
      }
    }

    return NextResponse.json({
      success: true,
      progressPercentage,
      certificateGenerated: progressPercentage === 100,
    })
  } catch (error) {
    console.error("Error completing lesson:", error)
    return NextResponse.json({ error: "Failed to complete lesson" }, { status: 500 })
  }
}
