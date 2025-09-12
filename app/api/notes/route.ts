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

    const { lessonId, content, timestamp } = await request.json()

    const note = await db.query(
      `INSERT INTO notes (user_id, lesson_id, content, timestamp, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [payload.userId, lessonId, content, timestamp],
    )

    return NextResponse.json(note.rows[0])
  } catch (error) {
    console.error("Error creating note:", error)
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
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
    const lessonId = searchParams.get("lessonId")

    if (!lessonId) {
      return NextResponse.json({ error: "Lesson ID required" }, { status: 400 })
    }

    const notes = await db.query(
      `SELECT * FROM notes 
       WHERE user_id = $1 AND lesson_id = $2 
       ORDER BY timestamp ASC`,
      [payload.userId, lessonId],
    )

    return NextResponse.json(notes.rows)
  } catch (error) {
    console.error("Error fetching notes:", error)
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
  }
}
