import { type NextRequest, NextResponse } from "next/server"
import { courseOperations } from "@/lib/database/mongodb"
import { verifyToken } from "@/lib/auth/jwt"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const difficulty = searchParams.get("difficulty") || ""
    const priceRange = searchParams.get("priceRange") || ""
    const sortBy = searchParams.get("sortBy") || "created_at"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const instructorId = searchParams.get("instructor_id")

    const matchStage: any = { status: "published" }

    if (search) {
      matchStage.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    if (category) {
      matchStage.category = category
    }

    if (difficulty) {
      matchStage.difficulty = difficulty
    }

    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number)
      if (max) {
        matchStage.price = { $gte: min, $lte: max }
      } else {
        matchStage.price = { $gte: min }
      }
    }

    if (instructorId) {
      matchStage.instructor_id = new ObjectId(instructorId)
    }

    // Build aggregation pipeline
    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "instructor_id",
          foreignField: "_id",
          as: "instructor",
        },
      },
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "course_id",
          as: "enrollments",
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "course_id",
          as: "reviews",
        },
      },
      {
        $addFields: {
          instructor_name: { $arrayElemAt: ["$instructor.name", 0] },
          instructor_avatar: { $arrayElemAt: ["$instructor.avatar_url", 0] },
          enrollment_count: { $size: "$enrollments" },
          average_rating: { $avg: "$reviews.rating" },
          review_count: { $size: "$reviews" },
        },
      },
      {
        $project: {
          instructor: 0,
          enrollments: 0,
          reviews: 0,
        },
      },
    ]

    // Add sorting
    let sortStage: any = {}
    switch (sortBy) {
      case "price_low":
        sortStage = { price: 1 }
        break
      case "price_high":
        sortStage = { price: -1 }
        break
      case "rating":
        sortStage = { average_rating: -1 }
        break
      case "popular":
        sortStage = { enrollment_count: -1 }
        break
      default:
        sortStage = { created_at: -1 }
    }

    pipeline.push({ $sort: sortStage })
    pipeline.push({ $skip: (page - 1) * limit })
    pipeline.push({ $limit: limit })

    const { db } = await import("@/lib/database/mongodb").then((m) => m.connectToDatabase())
    const courses = await db.collection("courses").aggregate(pipeline).toArray()

    // Get total count for pagination
    const totalCountPipeline = [{ $match: matchStage }, { $count: "total" }]
    const countResult = await db.collection("courses").aggregate(totalCountPipeline).toArray()
    const total = countResult[0]?.total || 0

    return NextResponse.json({
      courses: courses.map((course) => ({
        ...course,
        id: course._id.toString(),
        instructor_id: course.instructor_id.toString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      title,
      description,
      short_description,
      category,
      price,
      difficulty_level,
      thumbnail_url,
      status = "draft",
    } = await request.json()

    // Validate required fields
    if (!title || !short_description || !category || !difficulty_level) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const course = await courseOperations.create({
      title,
      description: description || "",
      instructor_id: payload.userId,
      price: Number(price) || 0,
      category: category.toLowerCase(),
      difficulty: difficulty_level,
      thumbnail_url:
        thumbnail_url ||
        `/placeholder.svg?height=720&width=1280&query=${encodeURIComponent(title + " course thumbnail")}`,
      status,
    })

    return NextResponse.json({
      ...course,
      id: course._id.toString(),
      instructor_id: course.instructor_id.toString(),
    })
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
