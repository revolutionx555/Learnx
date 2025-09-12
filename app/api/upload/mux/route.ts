import { type NextRequest, NextResponse } from "next/server"
import { uploadVideoToMux } from "@/lib/video/mux"
import { verifyToken } from "@/lib/auth/jwt"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user || user.role !== "instructor") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const formData = await request.formData()
    const videoFile = formData.get("video") as File

    if (!videoFile) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 })
    }

    const muxData = await uploadVideoToMux(videoFile)

    return NextResponse.json({
      success: true,
      assetId: muxData.assetId,
      playbackId: muxData.playbackId,
      status: muxData.status,
    })
  } catch (error) {
    console.error("Mux upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
