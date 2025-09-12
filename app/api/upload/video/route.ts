import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { uploadCourseVideo } from "@/lib/storage/mongodb-storage"

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

    const formData = await request.formData()
    const file = formData.get("video") as File
    const courseId = formData.get("courseId") as string
    const lessonId = formData.get("lessonId") as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (!courseId || !lessonId) {
      return NextResponse.json({ error: "Course ID and Lesson ID are required" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("video/")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    const uploadResult = await uploadCourseVideo(file, courseId, lessonId)

    if (uploadResult.error) {
      return NextResponse.json({ error: uploadResult.error }, { status: 500 })
    }

    return NextResponse.json({
      url: uploadResult.url,
      path: uploadResult.path,
      fileName: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Error uploading video:", error)
    return NextResponse.json({ error: "Failed to upload video" }, { status: 500 })
  }
}
