import { type NextRequest, NextResponse } from "next/server"
import {
  courseOperations,
  userOperations,
  enrollmentOperations,
  reviewOperations,
  lessonOperations,
} from "@/lib/database/mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const courseId = params.id

    const course = await courseOperations.findById(courseId)
    if (!course || course.status !== "published") {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Get instructor details
    const instructor = await userOperations.findById(course.instructor_id.toString())

    // Get enrollments count
    const enrollments = await enrollmentOperations.findByCourse(courseId)

    // Get reviews with user details
    const reviews = await reviewOperations.findByCourse(courseId)
    const reviewsWithUsers = await Promise.all(
      reviews.slice(0, 10).map(async (review) => {
        const user = await userOperations.findById(review.user_id.toString())
        return {
          ...review,
          id: review._id.toString(),
          user_name: user?.name || "Anonymous",
          user_avatar: user?.avatar_url || null,
        }
      }),
    )

    // Get course lessons
    const lessons = await lessonOperations.findByCourse(courseId)

    // Calculate average rating
    const averageRating =
      reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

    return NextResponse.json({
      ...course,
      id: course._id.toString(),
      instructor_id: course.instructor_id.toString(),
      instructor_name: instructor?.name || "Unknown",
      instructor_email: instructor?.email || "",
      instructor_avatar: instructor?.avatar_url || null,
      instructor_bio: instructor?.bio || "",
      enrollment_count: enrollments.length,
      average_rating: averageRating,
      review_count: reviews.length,
      lessons: lessons.map((lesson) => ({
        ...lesson,
        id: lesson._id.toString(),
        course_id: lesson.course_id.toString(),
      })),
      reviews: reviewsWithUsers,
    })
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 })
  }
}
