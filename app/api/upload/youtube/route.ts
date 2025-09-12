import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { google } from "googleapis"

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
})

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
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to YouTube as unlisted
    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: title || "Course Lesson",
          description: description || "Educational content",
          tags: ["education", "course", "learning"],
          categoryId: "27", // Education category
        },
        status: {
          privacyStatus: "unlisted", // Set as unlisted for course access
          embeddable: true,
        },
      },
      media: {
        body: buffer,
      },
    })

    const videoId = response.data.id
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`
    const embedUrl = `https://www.youtube.com/embed/${videoId}`

    return NextResponse.json({
      videoId,
      videoUrl,
      embedUrl,
      title: response.data.snippet?.title,
      duration: response.data.contentDetails?.duration,
    })
  } catch (error) {
    console.error("Error uploading to YouTube:", error)
    return NextResponse.json({ error: "Failed to upload video to YouTube" }, { status: 500 })
  }
}
