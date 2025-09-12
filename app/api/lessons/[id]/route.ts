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
    const lessonId = params.id

    const db = await connectToDatabase()

    const updateData = {
      ...body,
      updated_at: new Date(),
    }

    const result = await db.collection("lessons").updateOne({ id: lessonId }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Lesson updated successfully",
    })
  } catch (error) {
    console.error("Error updating lesson:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyAuthToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const lessonId = params.id
    const db = await connectToDatabase()

    const result = await db.collection("lessons").deleteOne({ id: lessonId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Lesson deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting lesson:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
