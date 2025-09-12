import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { verifyToken } from "@/lib/auth/jwt"

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

    const { lessonId, completed, watchTime } = await request.json()

    // Update or create progress
    const progress = await db.query(
      `INSERT INTO lesson_progress (user_id, lesson_id, completed, watch_time, last_watched_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id, lesson_id)
       DO UPDATE SET 
         completed = $3,
         watch_time = GREATEST(lesson_progress.watch_time, $4),
         last_watched_at = NOW()
       RETURNING *`,
      [payload.userId, lessonId, completed, watchTime],
    )

    return NextResponse.json(progress.rows[0])
  } catch (error) {
    console.error("Error updating progress:", error)
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
}

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

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json({ error: "Course ID required" }, { status: 400 })
    }

    const progress = await db.query(
      `SELECT lp.*, l.title as lesson_title
       FROM lesson_progress lp
       JOIN lessons l ON lp.lesson_id = l.id
       WHERE lp.user_id = $1 AND l.course_id = $2`,
      [payload.userId, courseId],
    )

    return NextResponse.json(progress.rows)
  } catch (error) {
    console.error("Error fetching progress:", error)
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
  }
}
