import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { queryOne } from "@/lib/database/connection"
import { generateCertificatePDF } from "@/lib/certificates/pdf-generator"

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

    const { courseId } = await request.json()

    // Check if user completed the course
    const enrollment = await queryOne<any>(
      `SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2 AND progress_percentage = 100`,
      [payload.userId, courseId],
    )

    if (!enrollment) {
      return NextResponse.json({ error: "Course not completed" }, { status: 400 })
    }

    // Check if certificate already exists
    const existingCert = await queryOne<any>(`SELECT * FROM certificates WHERE user_id = $1 AND course_id = $2`, [
      payload.userId,
      courseId,
    ])

    if (existingCert) {
      return NextResponse.json({ certificate: existingCert })
    }

    // Get course and user details
    const course = await queryOne<any>(
      `SELECT c.*, u.first_name as instructor_first_name, u.last_name as instructor_last_name 
       FROM courses c 
       JOIN users u ON c.instructor_id = u.id 
       WHERE c.id = $1`,
      [courseId],
    )

    const user = await queryOne<any>(`SELECT * FROM users WHERE id = $1`, [payload.userId])

    // Generate certificate number
    const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Generate PDF
    const pdfBuffer = await generateCertificatePDF({
      studentName: `${user.first_name} ${user.last_name}`,
      courseName: course.title,
      instructorName: `${course.instructor_first_name} ${course.instructor_last_name}`,
      completionDate: new Date(),
      certificateNumber,
      duration: course.duration_minutes,
    })

    // Save PDF to storage (in production, use AWS S3 or similar)
    const pdfUrl = `/certificates/${certificateNumber}.pdf`
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${certificateNumber}`

    // Create certificate record
    const certificate = await queryOne<any>(
      `INSERT INTO certificates (user_id, course_id, certificate_number, pdf_url, verification_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [payload.userId, courseId, certificateNumber, pdfUrl, verificationUrl],
    )

    return NextResponse.json({ certificate, pdfBuffer: pdfBuffer.toString("base64") })
  } catch (error) {
    console.error("Error generating certificate:", error)
    return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 })
  }
}
