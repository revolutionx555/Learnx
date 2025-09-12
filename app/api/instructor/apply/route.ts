import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { connectToDatabase } from "@/lib/database/mongodb"
import { uploadInstructorDocument } from "@/lib/storage/mongodb-storage"

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

    const formData = await request.formData()
    const bio = formData.get("bio") as string
    const expertiseAreas = JSON.parse(formData.get("expertise_areas") as string)
    const teachingExperience = formData.get("teaching_experience") as string
    const educationBackground = formData.get("education_background") as string
    const portfolioUrl = formData.get("portfolio_url") as string
    const linkedinUrl = formData.get("linkedin_url") as string
    const sampleContentUrl = formData.get("sample_content_url") as string
    const motivation = formData.get("motivation") as string
    const cvFile = formData.get("cv_file") as File | null

    // Validate required fields
    if (
      !bio ||
      !expertiseAreas ||
      expertiseAreas.length < 2 ||
      !teachingExperience ||
      !educationBackground ||
      !motivation
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Upload CV file if provided
    let cvUrl = null
    if (cvFile) {
      const uploadResult = await uploadInstructorDocument(cvFile, payload.userId, "cv")
      if (uploadResult.error) {
        return NextResponse.json({ error: "Failed to upload CV" }, { status: 500 })
      }
      cvUrl = uploadResult.url
    }

    // Create instructor application
    const application = await db.collection("instructor_applications").insertOne({
      user_id: payload.userId,
      bio,
      expertise_areas: expertiseAreas,
      teaching_experience: teachingExperience,
      education_background: educationBackground,
      portfolio_url: portfolioUrl || null,
      linkedin_url: linkedinUrl || null,
      sample_content_url: sampleContentUrl || null,
      motivation,
      cv_url: cvUrl,
      status: "pending",
      submitted_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    })

    // Send notification email to admins (optional)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/instructor-application`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: application.insertedId, userId: payload.userId }),
      })
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError)
      // Don't fail the application submission if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      applicationId: application.insertedId,
    })
  } catch (error) {
    console.error("Error processing instructor application:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
