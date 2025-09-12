import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { queryOne } from "@/lib/database/connection"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const discussionId = params.id
    const discussion = await queryOne<any>(
      `
      SELECT d.*, u.name as user_name, u.raw_json->>'avatar_url' as user_avatar
      FROM discussions d
      LEFT JOIN users_sync u ON d.user_id = u.id
      WHERE d.id = $1
    `,
      [discussionId],
    )

    if (!discussion) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 })
    }

    return NextResponse.json({
      discussion: {
        ...discussion,
        user: {
          first_name: discussion.user_name?.split(" ")[0] || "Unknown",
          last_name: discussion.user_name?.split(" ").slice(1).join(" ") || "",
          avatar_url: discussion.user_avatar,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching discussion:", error)
    return NextResponse.json({ error: "Failed to fetch discussion" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    const { title, content, isPinned } = await request.json()

    // Check if user owns the discussion or is an instructor
    const discussion = await queryOne<any>("SELECT user_id FROM discussions WHERE id = $1", [discussionId])

    if (!discussion || (discussion.user_id !== user.id && user.role !== "instructor")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updatedDiscussion = await queryOne<any>(
      `
      UPDATE discussions 
      SET title = COALESCE($2, title), 
          content = COALESCE($3, content),
          is_pinned = COALESCE($4, is_pinned),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
      [discussionId, title, content, isPinned],
    )

    return NextResponse.json({ discussion: updatedDiscussion })
  } catch (error) {
    console.error("Error updating discussion:", error)
    return NextResponse.json({ error: "Failed to update discussion" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if user owns the discussion or is an instructor
    const discussion = await queryOne<any>("SELECT user_id FROM discussions WHERE id = $1", [discussionId])

    if (!discussion || (discussion.user_id !== user.id && user.role !== "instructor")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await queryOne<any>("DELETE FROM discussions WHERE id = $1", [discussionId])

    return NextResponse.json({ message: "Discussion deleted successfully" })
  } catch (error) {
    console.error("Error deleting discussion:", error)
    return NextResponse.json({ error: "Failed to delete discussion" }, { status: 500 })
  }
}
