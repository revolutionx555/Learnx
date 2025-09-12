import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/database/mongodb"

export async function GET() {
  try {
    console.log("Testing MongoDB connection...")

    // Test MongoDB connection
    const { db } = await connectToDatabase()
    const result = await db.admin().ping()

    console.log("MongoDB connection successful:", result)

    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully",
      ping: result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("MongoDB connection failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
