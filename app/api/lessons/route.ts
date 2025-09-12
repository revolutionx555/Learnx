import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/database/mongodb"
import { verifyAuthToken } from "@/lib/auth/middleware"

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuthToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      content_type,
      content_url,
      duration_minutes,
      section_id,
      is_preview = false,
      is_required = true,
      youtube_embed_url,
    } = body

    if (!title || !section_id || !content_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Get the next order index for this section
    const lastLesson = await db.collection("lessons").findOne({ section_id }, { sort: { order_index: -1 } })

    const orderIndex = lastLesson ? lastLesson.order_index + 1 : 0

    const lessonData = {
      id: crypto.randomUUID(),
      title,
      description: description || "",
      content_type,
      content_url: content_url || "",
      duration_minutes: duration_minutes || 0,
      section_id,
      order_index: orderIndex,
      is_preview,
      is_required,
      youtube_embed_url: youtube_embed_url || "",
      created_at: new Date(),
      updated_at: new Date(),
    }

    await db.collection("lessons").insertOne(lessonData)

    return NextResponse.json({
      success: true,
      message: "Lesson created successfully",
      data: lessonData,
    })
  } catch (error) {
    console.error("Error creating lesson:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
