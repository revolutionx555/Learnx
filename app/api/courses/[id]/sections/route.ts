import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/database/mongodb"
import { verifyAuthToken } from "@/lib/auth/middleware"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyAuthToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await connectToDatabase()
    const courseId = params.id

    // Get course sections with lessons
    const sections = await db
      .collection("course_sections")
      .find({ course_id: courseId })
      .sort({ order_index: 1 })
      .toArray()

    // Get lessons for each section
    for (const section of sections) {
      const lessons = await db.collection("lessons").find({ section_id: section.id }).sort({ order_index: 1 }).toArray()
      section.lessons = lessons
    }

    return NextResponse.json({ success: true, data: sections })
  } catch (error) {
    console.error("Error fetching course sections:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyAuthToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description } = body
    const courseId = params.id

    if (!title) {
      return NextResponse.json({ error: "Section title is required" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Get the next order index
    const lastSection = await db
      .collection("course_sections")
      .findOne({ course_id: courseId }, { sort: { order_index: -1 } })

    const orderIndex = lastSection ? lastSection.order_index + 1 : 0

    const sectionData = {
      id: crypto.randomUUID(),
      course_id: courseId,
      title,
      description: description || "",
      order_index: orderIndex,
      created_at: new Date(),
      updated_at: new Date(),
    }

    await db.collection("course_sections").insertOne(sectionData)

    return NextResponse.json({
      success: true,
      message: "Section created successfully",
      data: sectionData,
    })
  } catch (error) {
    console.error("Error creating course section:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
