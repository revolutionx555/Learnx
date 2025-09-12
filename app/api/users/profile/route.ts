import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/middleware"
import { userOperations } from "@/lib/database/mongodb"

export const GET = requireAuth(async (request) => {
  try {
    const user = await userOperations.findById(request.user.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove password hash from response
    const { password_hash: _, ...userResponse } = user

    return NextResponse.json({
      success: true,
      data: {
        ...userResponse,
        id: user._id.toString(),
      },
    })
  } catch (error) {
    console.error("Get user profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const PUT = requireAuth(async (request) => {
  try {
    const body = await request.json()
    const { name, bio, avatar_url } = body

    const result = await userOperations.updateById(request.user.id, {
      name,
      bio,
      avatar_url,
    })

    if (!result.modifiedCount) {
      return NextResponse.json({ error: "User not found or no changes made" }, { status: 404 })
    }

    // Get updated user
    const updatedUser = await userOperations.findById(request.user.id)
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove password hash from response
    const { password_hash: _, ...userResponse } = updatedUser

    return NextResponse.json({
      success: true,
      data: {
        ...userResponse,
        id: updatedUser._id.toString(),
      },
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
