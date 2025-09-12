import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { discussionQueries } from "@/lib/database/queries"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const discussionId = params.id
    const replies = await discussionQueries.getDiscussionReplies(discussionId)
    return NextResponse.json({ replies })
  } catch (error) {
    console.error("Error fetching replies:", error)
    return NextResponse.json({ error: "Failed to fetch replies" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const discussionId = params.id
    const { content, parentReplyId } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const reply = await discussionQueries.createDiscussionReply({
      discussionId,
      userId: user.id,
      content,
      parentReplyId: parentReplyId || undefined,
    })

    return NextResponse.json({ reply }, { status: 201 })
  } catch (error) {
    console.error("Error creating reply:", error)
    return NextResponse.json({ error: "Failed to create reply" }, { status: 500 })
  }
}
