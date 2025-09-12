import { jsPDF } from "jspdf"

interface CertificateData {
  studentName: string
  courseName: string
  instructorName: string
  completionDate: Date
  certificateNumber: string
  duration: number
}

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  })

  // Certificate background and styling
  doc.setFillColor(248, 250, 252) // Light blue background
  doc.rect(0, 0, 297, 210, "F")

  // Border
  doc.setDrawColor(59, 130, 246) // Blue border
  doc.setLineWidth(2)
  doc.rect(10, 10, 277, 190)

  // Inner border
  doc.setDrawColor(147, 197, 253) // Light blue
  doc.setLineWidth(1)
  doc.rect(15, 15, 267, 180)

  // Header
  doc.setFontSize(32)
  doc.setTextColor(30, 58, 138) // Dark blue
  doc.setFont("helvetica", "bold")
  doc.text("CERTIFICATE OF COMPLETION", 148.5, 45, { align: "center" })

  // Decorative line
  doc.setDrawColor(251, 191, 36) // Gold
  doc.setLineWidth(3)
  doc.line(80, 55, 217, 55)

  // Main content
  doc.setFontSize(16)
  doc.setTextColor(75, 85, 99) // Gray
  doc.setFont("helvetica", "normal")
  doc.text("This is to certify that", 148.5, 75, { align: "center" })

  // Student name
  doc.setFontSize(28)
  doc.setTextColor(30, 58, 138)
  doc.setFont("helvetica", "bold")
  doc.text(data.studentName, 148.5, 95, { align: "center" })

  // Course completion text
  doc.setFontSize(16)
  doc.setTextColor(75, 85, 99)
  doc.setFont("helvetica", "normal")
  doc.text("has successfully completed the course", 148.5, 110, { align: "center" })

  // Course name
  doc.setFontSize(22)
  doc.setTextColor(30, 58, 138)
  doc.setFont("helvetica", "bold")
  doc.text(data.courseName, 148.5, 130, { align: "center" })

  // Duration and date
  const durationHours = Math.round(data.duration / 60)
  doc.setFontSize(14)
  doc.setTextColor(75, 85, 99)
  doc.setFont("helvetica", "normal")
  doc.text(`Duration: ${durationHours} hours`, 148.5, 145, { align: "center" })

  // Completion date
  const dateStr = data.completionDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  doc.text(`Completed on ${dateStr}`, 148.5, 155, { align: "center" })

  // Instructor signature area
  doc.setFontSize(12)
  doc.text("Instructor:", 50, 175)
  doc.text(data.instructorName, 50, 185)
  doc.line(50, 190, 120, 190) // Signature line

  // Certificate number and verification
  doc.text("Certificate ID:", 180, 175)
  doc.text(data.certificateNumber, 180, 185)
  doc.text("Verify at: learnx.com/verify", 180, 195)

  // Logo placeholder (you can add actual logo here)
  doc.setFillColor(59, 130, 246)
  doc.circle(40, 40, 8, "F")
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.text("LX", 40, 42, { align: "center" })

  return Buffer.from(doc.output("arraybuffer"))
}
