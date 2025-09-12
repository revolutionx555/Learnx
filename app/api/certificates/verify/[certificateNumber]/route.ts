import { type NextRequest, NextResponse } from "next/server"
import { queryOne } from "@/lib/database/connection"

export async function GET(request: NextRequest, { params }: { params: { certificateNumber: string } }) {
  try {
    const { certificateNumber } = params

    const certificate = await queryOne<any>(
      `SELECT 
        cert.*,
        u.first_name,
        u.last_name,
        c.title as course_title,
        c.duration_minutes,
        instructor.first_name as instructor_first_name,
        instructor.last_name as instructor_last_name
       FROM certificates cert
       JOIN users u ON cert.user_id = u.id
       JOIN courses c ON cert.course_id = c.id
       JOIN users instructor ON c.instructor_id = instructor.id
       WHERE cert.certificate_number = $1`,
      [certificateNumber],
    )

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    return NextResponse.json({
      valid: true,
      certificate: {
        certificateNumber: certificate.certificate_number,
        studentName: `${certificate.first_name} ${certificate.last_name}`,
        courseName: certificate.course_title,
        instructorName: `${certificate.instructor_first_name} ${certificate.instructor_last_name}`,
        issuedAt: certificate.issued_at,
        duration: certificate.duration_minutes,
      },
    })
  } catch (error) {
    console.error("Error verifying certificate:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
