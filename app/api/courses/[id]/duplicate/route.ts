import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/database/mongodb"
import { verifyAuthToken } from "@/lib/auth/middleware"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyAuthToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const courseId = params.id
    const { db } = await connectToDatabase()

    // Get the original course
    const originalCourse = await db.collection("courses").findOne({ _id: new ObjectId(courseId) })

    if (!originalCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Create duplicate course
    const duplicatedCourse = {
      ...originalCourse,
      _id: new ObjectId(),
      title: `${originalCourse.title} (Copy)`,
      status: "draft",
      created_at: new Date(),
      updated_at: new Date(),
      published_at: null,
    }

    delete duplicatedCourse._id
    const result = await db.collection("courses").insertOne(duplicatedCourse)
    const newCourseId = result.insertedId.toString()

    // Duplicate sections
    const sections = await db.collection("course_sections").find({ course_id: courseId }).toArray()

    for (const section of sections) {
      const newSectionId = crypto.randomUUID()
      const duplicatedSection = {
        ...section,
        id: newSectionId,
        course_id: newCourseId,
        created_at: new Date(),
        updated_at: new Date(),
      }

      delete duplicatedSection._id
      await db.collection("course_sections").insertOne(duplicatedSection)

      // Duplicate lessons for this section
      const lessons = await db.collection("lessons").find({ section_id: section.id }).toArray()

      for (const lesson of lessons) {
        const duplicatedLesson = {
          ...lesson,
          id: crypto.randomUUID(),
          section_id: newSectionId,
          created_at: new Date(),
          updated_at: new Date(),
        }

        delete duplicatedLesson._id
        await db.collection("lessons").insertOne(duplicatedLesson)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Course duplicated successfully",
      courseId: newCourseId,
    })
  } catch (error) {
    console.error("Error duplicating course:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
