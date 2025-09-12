import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/database/mongodb"
import { verifyAuthToken } from "@/lib/auth/middleware"

export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyAuthToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { updates } = body

    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: "Updates must be an array" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Update each lesson's order_index
    const updatePromises = updates.map(({ id, order_index }) =>
      db.collection("lessons").updateOne({ id }, { $set: { order_index, updated_at: new Date() } }),
    )

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      message: "Lessons reordered successfully",
    })
  } catch (error) {
    console.error("Error reordering lessons:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
