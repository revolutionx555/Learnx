import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { getCollection } from "@/lib/database/mongodb"
import { ObjectId } from "mongodb"

export const POST = requireAuth(async (request, { params }) => {
  try {
    if (request.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { reason } = body
    const applicationId = params.id

    const applications = await getCollection("instructor_applications")
    const application = await applications.findOne({ _id: new ObjectId(applicationId) })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    await applications.updateOne(
      { _id: new ObjectId(applicationId) },
      {
        $set: {
          status: "rejected",
          rejection_reason: reason,
          reviewed_at: new Date(),
          reviewed_by: request.user.id,
        },
      },
    )

    console.log("Rejected instructor application:", applicationId, "Reason:", reason)

    return NextResponse.json({
      success: true,
      message: "Instructor application rejected",
      data: {
        application_id: applicationId,
        status: "rejected",
        reason,
      },
    })
  } catch (error) {
    console.error("Reject instructor application error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
