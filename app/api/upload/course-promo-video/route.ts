import { type NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth/middleware"

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuthToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const courseId = formData.get("courseId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("video/")) {
      return NextResponse.json({ error: "File must be a video" }, { status: 400 })
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size must be less than 50MB" }, { status: 400 })
    }

    // For now, return a placeholder URL
    // In production, you would upload to your storage service (AWS S3, Cloudinary, etc.)
    const videoUrl = `/placeholder-video.mp4?courseId=${courseId}&filename=${encodeURIComponent(file.name)}`

    return NextResponse.json({
      success: true,
      url: videoUrl,
      message: "Promo video uploaded successfully",
    })
  } catch (error) {
    console.error("Error uploading promo video:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
