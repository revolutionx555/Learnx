import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { getUserById, getQuizAnalytics } from "@/lib/database/queries"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const user = await getUserById(decoded.userId)
    if (!user || user.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const analytics = await getQuizAnalytics(params.id)
    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching quiz analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
