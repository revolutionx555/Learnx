import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { getCollection } from "@/lib/database/mongodb"
import { userOperations } from "@/lib/database/mongodb"
import { ObjectId } from "mongodb"

export const POST = requireAuth(async (request, { params }) => {
  try {
    if (request.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    const applicationId = params.id

    const applications = await getCollection("instructor_applications")
    const application = await applications.findOne({ _id: new ObjectId(applicationId) })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const existingUser = await userOperations.findByEmail(application.email)
    let instructorUser

    if (existingUser) {
      // Update existing user to instructor role
      await userOperations.updateById(existingUser._id.toString(), { role: "instructor" })
      instructorUser = { ...existingUser, role: "instructor" }
    } else {
      // Create new instructor user account
      instructorUser = await userOperations.create({
        email: application.email,
        name: application.name,
        role: "instructor",
      })
    }

    await applications.updateOne(
      { _id: new ObjectId(applicationId) },
      {
        $set: {
          status: "approved",
          reviewed_at: new Date(),
          reviewed_by: request.user.id,
        },
      },
    )

    console.log("Approved instructor application:", applicationId)

    return NextResponse.json({
      success: true,
      message: "Instructor application approved successfully",
      data: {
        application_id: applicationId,
        status: "approved",
        instructor_user_id: instructorUser._id.toString(),
      },
    })
  } catch (error) {
    console.error("Approve instructor application error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
