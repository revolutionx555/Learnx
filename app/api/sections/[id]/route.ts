import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/database/mongodb"
import { verifyAuthToken } from "@/lib/auth/middleware"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyAuthToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description } = body
    const sectionId = params.id

    if (!title) {
      return NextResponse.json({ error: "Section title is required" }, { status: 400 })
    }

    const db = await connectToDatabase()

    const updateData = {
      title,
      description: description || "",
      updated_at: new Date(),
    }

    const result = await db.collection("course_sections").updateOne({ id: sectionId }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Section updated successfully",
    })
  } catch (error) {
    console.error("Error updating section:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyAuthToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sectionId = params.id
    const db = await connectToDatabase()

    // Delete all lessons in this section first
    await db.collection("lessons").deleteMany({ section_id: sectionId })

    // Delete the section
    const result = await db.collection("course_sections").deleteOne({ id: sectionId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Section and all its lessons deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting section:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
