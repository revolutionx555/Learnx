import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { connectToDatabase } from "@/lib/database/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const courseId = params.id
    const { db } = await connectToDatabase()

    // Verify user owns the course
    const course = await db.collection("courses").findOne({
      _id: new ObjectId(courseId),
      instructor_id: payload.userId,
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const newStatus = course.status === "published" ? "draft" : "published"

    const updatedCourse = await db.collection("courses").findOneAndUpdate(
      { _id: new ObjectId(courseId) },
      {
        $set: {
          status: newStatus,
          published_at: newStatus === "published" ? new Date() : null,
          updated_at: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return NextResponse.json({
      success: true,
      course: updatedCourse.value,
      message: `Course ${newStatus === "published" ? "published" : "unpublished"} successfully`,
    })
  } catch (error) {
    console.error("Error updating course status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
