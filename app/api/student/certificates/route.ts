import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { queryMany } from "@/lib/database/connection"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const certificates = await queryMany<any>(
      `
      SELECT 
        cert.id,
        cert.certificate_number,
        cert.issued_at,
        cert.verification_url,
        cert.pdf_url,
        c.title as course_title,
        c.thumbnail_url as course_thumbnail
      FROM certificates cert
      JOIN courses c ON cert.course_id = c.id
      WHERE cert.user_id = $1
      ORDER BY cert.issued_at DESC
    `,
      [payload.userId],
    )

    return NextResponse.json(certificates)
  } catch (error) {
    console.error("Error fetching certificates:", error)
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 })
  }
}
