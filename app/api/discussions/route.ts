import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { createDiscussion, getDiscussionsByCourse } from "@/lib/database/queries"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json({ error: "Course ID required" }, { status: 400 })
    }

    const discussions = await getDiscussionsByCourse(courseId)
    return NextResponse.json({ discussions })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch discussions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await verifyToken(token)
    const { courseId, title, content } = await request.json()

    const discussion = await createDiscussion({
      courseId,
      userId: user.id,
      title,
      content,
    })

    return NextResponse.json({ discussion }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create discussion" }, { status: 500 })
  }
}
