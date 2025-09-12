// Test script to verify MongoDB integration
const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const MONGODB_DB = process.env.MONGODB_DB || "learnx"

async function testMongoDBIntegration() {
  console.log("🧪 Testing MongoDB Integration for Learn X Platform")
  console.log("=".repeat(50))

  let client
  try {
    // Test connection
    console.log("1. Testing MongoDB connection...")
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log("✅ Successfully connected to MongoDB")

    const db = client.db(MONGODB_DB)
    console.log(`✅ Connected to database: ${MONGODB_DB}`)

    // Test collections creation and basic operations
    console.log("\n2. Testing collections and basic operations...")

    // Test users collection
    const users = db.collection("users")
    const testUser = {
      email: "test@example.com",
      name: "Test User",
      role: "student",
      email_verified: false,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const userResult = await users.insertOne(testUser)
    console.log("✅ Created test user:", userResult.insertedId)

    // Test courses collection
    const courses = db.collection("courses")
    const testCourse = {
      title: "Test Course",
      description: "A test course for MongoDB integration",
      instructor_id: userResult.insertedId,
      price: 99.99,
      category: "programming",
      difficulty: "beginner",
      duration: 120,
      status: "draft",
      created_at: new Date(),
      updated_at: new Date(),
    }

    const courseResult = await courses.insertOne(testCourse)
    console.log("✅ Created test course:", courseResult.insertedId)

    // Test enrollments collection
    const enrollments = db.collection("enrollments")
    const testEnrollment = {
      user_id: userResult.insertedId,
      course_id: courseResult.insertedId,
      progress: 0,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const enrollmentResult = await enrollments.insertOne(testEnrollment)
    console.log("✅ Created test enrollment:", enrollmentResult.insertedId)

    // Test aggregation pipeline (similar to what the API uses)
    console.log("\n3. Testing aggregation pipeline...")
    const pipeline = [
      { $match: { status: "draft" } },
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
        $addFields: {
          instructor_name: { $arrayElemAt: ["$instructor.name", 0] },
          enrollment_count: { $size: "$enrollments" },
        },
      },
    ]

    const aggregationResult = await courses.aggregate(pipeline).toArray()
    console.log("✅ Aggregation pipeline works:", aggregationResult.length, "results")

    // Test indexes creation
    console.log("\n4. Testing index creation...")
    await users.createIndex({ email: 1 }, { unique: true })
    await courses.createIndex({ instructor_id: 1 })
    await courses.createIndex({ category: 1 })
    await courses.createIndex({ status: 1 })
    await enrollments.createIndex({ user_id: 1, course_id: 1 }, { unique: true })
    console.log("✅ Created all necessary indexes")

    // Clean up test data
    console.log("\n5. Cleaning up test data...")
    await enrollments.deleteOne({ _id: enrollmentResult.insertedId })
    await courses.deleteOne({ _id: courseResult.insertedId })
    await users.deleteOne({ _id: userResult.insertedId })
    console.log("✅ Cleaned up test data")

    console.log("\n🎉 MongoDB Integration Test Completed Successfully!")
    console.log("=".repeat(50))
    console.log("✅ Database connection: Working")
    console.log("✅ Collections: Working")
    console.log("✅ CRUD operations: Working")
    console.log("✅ Aggregation pipelines: Working")
    console.log("✅ Indexes: Working")
    console.log("\n🚀 Your Learn X platform is ready to use with MongoDB!")
  } catch (error) {
    console.error("❌ MongoDB Integration Test Failed:")
    console.error(error)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log("🔌 Disconnected from MongoDB")
    }
  }
}

// Run the test
testMongoDBIntegration()
