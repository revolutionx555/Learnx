import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { getCollection } from "@/lib/database/mongodb"

export const GET = requireAuth(async (request) => {
  try {
    if (request.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    const applications = await getCollection("instructor_applications")
    const applicationsList = await applications.find({}).sort({ applied_at: -1 }).toArray()

    const formattedApplications = applicationsList.map((app) => ({
      ...app,
      id: app._id.toString(),
    }))

    return NextResponse.json({
      success: true,
      data: formattedApplications,
    })
  } catch (error) {
    console.error("Get instructor applications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const POST = requireAuth(async (request) => {
  try {
    if (request.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { email, name, bio, expertise, experience, linkedin, website, cv_url } = body

    if (!email || !name || !bio || !expertise || !experience) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const applications = await getCollection("instructor_applications")

    // Check if application already exists
    const existingApplication = await applications.findOne({ email })
    if (existingApplication) {
      return NextResponse.json({ error: "Application already exists for this email" }, { status: 409 })
    }

    const newApplication = {
      email,
      name,
      bio,
      expertise,
      experience,
      linkedin,
      website,
      cv_url,
      status: "pending",
      applied_at: new Date(),
    }

    const result = await applications.insertOne(newApplication)

    return NextResponse.json({
      success: true,
      data: {
        ...newApplication,
        id: result.insertedId.toString(),
      },
      message: "Instructor application submitted successfully",
    })
  } catch (error) {
    console.error("Create instructor application error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
