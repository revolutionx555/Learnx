import { type NextRequest, NextResponse } from "next/server"
import { hashPassword, validatePassword } from "@/lib/auth/password"
import crypto from "crypto"
import { uploadInstructorCV } from "@/lib/storage/mongodb-storage"
import { connectToDatabase } from "@/lib/database/mongodb"
import { sendInstructorApplicationEmail, sendAdminNotification } from "@/lib/email/resend"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const first_name = formData.get("first_name") as string
    const last_name = formData.get("last_name") as string
    const bio = formData.get("bio") as string
    const expertise = formData.get("expertise") as string
    const experience = formData.get("experience") as string
    const linkedin = formData.get("linkedin") as string
    const website = formData.get("website") as string
    const cvFile = formData.get("cv") as File | null

    // Validate required fields
    if (!email || !password || !first_name || !last_name || !bio || !expertise || !experience) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: "Password validation failed", details: passwordValidation.errors },
        { status: 400 },
      )
    }

    // Validate bio length
    if (bio.length < 100) {
      return NextResponse.json({ error: "Bio must be at least 100 characters long" }, { status: 400 })
    }

    const applicationId = crypto.randomUUID()

    let cvUrl = null
    if (cvFile && cvFile.size > 0) {
      console.log("CV file received:", cvFile.name, cvFile.size)
      const uploadResult = await uploadInstructorCV(cvFile, applicationId)

      if (uploadResult.error) {
        return NextResponse.json({ error: "Failed to upload CV" }, { status: 500 })
      }

      cvUrl = uploadResult.url
    }

    const applicationData = {
      id: applicationId,
      email,
      first_name,
      last_name,
      bio,
      expertise,
      experience,
      linkedin: linkedin || null,
      website: website || null,
      cv_url: cvUrl,
      status: "pending",
      applied_at: new Date().toISOString(),
      password_hash: await hashPassword(password),
    }

    console.log("Instructor application received:", {
      ...applicationData,
      password_hash: "[REDACTED]",
    })

    const db = await connectToDatabase()

    // Store application in MongoDB instructor_applications collection
    await db.collection("instructor_applications").insertOne(applicationData)

    // Send confirmation email to applicant via Resend
    await sendInstructorApplicationEmail(email, {
      firstName: first_name,
      lastName: last_name,
      applicationId,
    })

    // Send notification email to admin team
    await sendAdminNotification(
      "New Instructor Application",
      `New instructor application received from ${first_name} ${last_name} (${email}). Application ID: ${applicationId}`,
    )

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully. We'll review it within 2-3 business days.",
      data: {
        application_id: applicationId,
        email,
        status: "pending",
        cv_uploaded: !!cvUrl,
      },
    })
  } catch (error) {
    console.error("Instructor application error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
