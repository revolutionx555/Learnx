import { type NextRequest, NextResponse } from "next/server"
import { queryOne } from "@/lib/database/connection"
import { generateCertificatePDF } from "@/lib/certificates/pdf-generator"

export async function GET(request: NextRequest, { params }: { params: { certificateNumber: string } }) {
  try {
    const { certificateNumber } = params

    // Get certificate details
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

    // Generate PDF
    const pdfBuffer = await generateCertificatePDF({
      studentName: `${certificate.first_name} ${certificate.last_name}`,
      courseName: certificate.course_title,
      instructorName: `${certificate.instructor_first_name} ${certificate.instructor_last_name}`,
      completionDate: new Date(certificate.issued_at),
      certificateNumber: certificate.certificate_number,
      duration: certificate.duration_minutes,
    })

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificate-${certificateNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error downloading certificate:", error)
    return NextResponse.json({ error: "Failed to download certificate" }, { status: 500 })
  }
}
