import { MongoClient, type Db, type Collection, ObjectId } from "mongodb"

let client: MongoClient
let db: Db

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://vercel-admin-user:I8OQ7dapFYE8kTnb@learnx.fyz9bq8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const MONGODB_DB = process.env.MONGODB_DB || "learnx"

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log("[v0] Connected to MongoDB")
  }

  if (!db) {
    db = client.db(MONGODB_DB)
    console.log("[v0] Connected to database:", MONGODB_DB)
  }

  return { client, db }
}

export async function getCollection(name: string): Promise<Collection> {
  const { db } = await connectToDatabase()
  return db.collection(name)
}

export const userOperations = {
  async findByEmail(email: string) {
    try {
      const users = await getCollection("users")
      const user = await users.findOne({ email })
      console.log("[v0] Found user by email:", !!user)
      return user
    } catch (error) {
      console.error("[v0] Error finding user by email:", error)
      return null
    }
  },

  async create(userData: {
    email: string
    name?: string
    password_hash?: string
    role?: string
  }) {
    try {
      const users = await getCollection("users")
      const newUser = {
        ...userData,
        role: userData.role || "student",
        created_at: new Date(),
        updated_at: new Date(),
        email_verified: false,
      }

      const result = await users.insertOne(newUser)
      console.log("[v0] Created user with ID:", result.insertedId)
      return { ...newUser, _id: result.insertedId }
    } catch (error) {
      console.error("[v0] Error creating user:", error)
      throw error
    }
  },

  async findById(id: string) {
    try {
      const users = await getCollection("users")
      const user = await users.findOne({ _id: new ObjectId(id) })
      console.log("[v0] Found user by ID:", !!user)
      return user
    } catch (error) {
      console.error("[v0] Error finding user by ID:", error)
      return null
    }
  },

  async updateById(id: string, updateData: any) {
    try {
      const users = await getCollection("users")
      const result = await users.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updated_at: new Date() } },
      )
      console.log("[v0] Updated user, modified count:", result.modifiedCount)
      return result
    } catch (error) {
      console.error("[v0] Error updating user:", error)
      throw error
    }
  },

  async deleteById(id: string) {
    try {
      const users = await getCollection("users")
      const result = await users.deleteOne({ _id: new ObjectId(id) })
      console.log("[v0] Deleted user, deleted count:", result.deletedCount)
      return result
    } catch (error) {
      console.error("[v0] Error deleting user:", error)
      throw error
    }
  },
}

export const courseOperations = {
  async create(courseData: {
    title: string
    description?: string
    instructor_id: string
    price?: number
    category: string
    difficulty?: string
    duration?: number
    thumbnail_url?: string
    status?: string
  }) {
    try {
      const courses = await getCollection("courses")
      const newCourse = {
        ...courseData,
        instructor_id: new ObjectId(courseData.instructor_id),
        price: courseData.price || 0,
        difficulty: courseData.difficulty || "beginner",
        duration: courseData.duration || 0,
        status: courseData.status || "draft",
        created_at: new Date(),
        updated_at: new Date(),
      }

      const result = await courses.insertOne(newCourse)
      console.log("[v0] Created course with ID:", result.insertedId)
      return { ...newCourse, _id: result.insertedId }
    } catch (error) {
      console.error("[v0] Error creating course:", error)
      throw error
    }
  },

  async findById(id: string) {
    try {
      const courses = await getCollection("courses")
      const course = await courses.findOne({ _id: new ObjectId(id) })
      console.log("[v0] Found course by ID:", !!course)
      return course
    } catch (error) {
      console.error("[v0] Error finding course by ID:", error)
      return null
    }
  },

  async findByInstructor(instructorId: string) {
    try {
      const courses = await getCollection("courses")
      const coursesList = await courses.find({ instructor_id: new ObjectId(instructorId) }).toArray()
      console.log("[v0] Found courses for instructor:", coursesList.length)
      return coursesList
    } catch (error) {
      console.error("[v0] Error finding courses by instructor:", error)
      return []
    }
  },

  async findPublished() {
    try {
      const courses = await getCollection("courses")
      const coursesList = await courses.find({ status: "published" }).toArray()
      console.log("[v0] Found published courses:", coursesList.length)
      return coursesList
    } catch (error) {
      console.error("[v0] Error finding published courses:", error)
      return []
    }
  },

  async updateById(id: string, updateData: any) {
    try {
      const courses = await getCollection("courses")
      const result = await courses.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updated_at: new Date() } },
      )
      console.log("[v0] Updated course, modified count:", result.modifiedCount)
      return result
    } catch (error) {
      console.error("[v0] Error updating course:", error)
      throw error
    }
  },

  async deleteById(id: string) {
    try {
      const courses = await getCollection("courses")
      const result = await courses.deleteOne({ _id: new ObjectId(id) })
      console.log("[v0] Deleted course, deleted count:", result.deletedCount)
      return result
    } catch (error) {
      console.error("[v0] Error deleting course:", error)
      throw error
    }
  },
}

export const lessonOperations = {
  async create(lessonData: {
    course_id: string
    title: string
    description?: string
    video_url?: string
    content?: string
    duration?: number
    order_index: number
    is_free?: boolean
  }) {
    try {
      const lessons = await getCollection("lessons")
      const newLesson = {
        ...lessonData,
        course_id: new ObjectId(lessonData.course_id),
        duration: lessonData.duration || 0,
        is_free: lessonData.is_free || false,
        created_at: new Date(),
        updated_at: new Date(),
      }

      const result = await lessons.insertOne(newLesson)
      console.log("[v0] Created lesson with ID:", result.insertedId)
      return { ...newLesson, _id: result.insertedId }
    } catch (error) {
      console.error("[v0] Error creating lesson:", error)
      throw error
    }
  },

  async findByCourse(courseId: string) {
    try {
      const lessons = await getCollection("lessons")
      const lessonsList = await lessons
        .find({ course_id: new ObjectId(courseId) })
        .sort({ order_index: 1 })
        .toArray()
      console.log("[v0] Found lessons for course:", lessonsList.length)
      return lessonsList
    } catch (error) {
      console.error("[v0] Error finding lessons by course:", error)
      return []
    }
  },

  async findById(id: string) {
    try {
      const lessons = await getCollection("lessons")
      const lesson = await lessons.findOne({ _id: new ObjectId(id) })
      console.log("[v0] Found lesson by ID:", !!lesson)
      return lesson
    } catch (error) {
      console.error("[v0] Error finding lesson by ID:", error)
      return null
    }
  },

  async updateById(id: string, updateData: any) {
    try {
      const lessons = await getCollection("lessons")
      const result = await lessons.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updated_at: new Date() } },
      )
      console.log("[v0] Updated lesson, modified count:", result.modifiedCount)
      return result
    } catch (error) {
      console.error("[v0] Error updating lesson:", error)
      throw error
    }
  },

  async deleteById(id: string) {
    try {
      const lessons = await getCollection("lessons")
      const result = await lessons.deleteOne({ _id: new ObjectId(id) })
      console.log("[v0] Deleted lesson, deleted count:", result.deletedCount)
      return result
    } catch (error) {
      console.error("[v0] Error deleting lesson:", error)
      throw error
    }
  },
}

export const enrollmentOperations = {
  async create(enrollmentData: {
    user_id: string
    course_id: string
  }) {
    try {
      const enrollments = await getCollection("enrollments")
      const newEnrollment = {
        user_id: new ObjectId(enrollmentData.user_id),
        course_id: new ObjectId(enrollmentData.course_id),
        progress: 0,
        created_at: new Date(),
        updated_at: new Date(),
      }

      const result = await enrollments.insertOne(newEnrollment)
      console.log("[v0] Created enrollment with ID:", result.insertedId)
      return { ...newEnrollment, _id: result.insertedId }
    } catch (error) {
      console.error("[v0] Error creating enrollment:", error)
      throw error
    }
  },

  async findByUser(userId: string) {
    try {
      const enrollments = await getCollection("enrollments")
      const enrollmentsList = await enrollments.find({ user_id: new ObjectId(userId) }).toArray()
      console.log("[v0] Found enrollments for user:", enrollmentsList.length)
      return enrollmentsList
    } catch (error) {
      console.error("[v0] Error finding enrollments by user:", error)
      return []
    }
  },

  async findByCourse(courseId: string) {
    try {
      const enrollments = await getCollection("enrollments")
      const enrollmentsList = await enrollments.find({ course_id: new ObjectId(courseId) }).toArray()
      console.log("[v0] Found enrollments for course:", enrollmentsList.length)
      return enrollmentsList
    } catch (error) {
      console.error("[v0] Error finding enrollments by course:", error)
      return []
    }
  },

  async findByUserAndCourse(userId: string, courseId: string) {
    try {
      const enrollments = await getCollection("enrollments")
      const enrollment = await enrollments.findOne({
        user_id: new ObjectId(userId),
        course_id: new ObjectId(courseId),
      })
      console.log("[v0] Found enrollment for user and course:", !!enrollment)
      return enrollment
    } catch (error) {
      console.error("[v0] Error finding enrollment by user and course:", error)
      return null
    }
  },

  async updateProgress(userId: string, courseId: string, progress: number) {
    try {
      const enrollments = await getCollection("enrollments")
      const result = await enrollments.updateOne(
        { user_id: new ObjectId(userId), course_id: new ObjectId(courseId) },
        {
          $set: {
            progress,
            updated_at: new Date(),
            ...(progress >= 100 && { completed_at: new Date() }),
          },
        },
      )
      console.log("[v0] Updated enrollment progress, modified count:", result.modifiedCount)
      return result
    } catch (error) {
      console.error("[v0] Error updating enrollment progress:", error)
      throw error
    }
  },
}

export const progressOperations = {
  async create(progressData: {
    user_id: string
    lesson_id: string
    completed?: boolean
  }) {
    try {
      const progress = await getCollection("progress")
      const newProgress = {
        user_id: new ObjectId(progressData.user_id),
        lesson_id: new ObjectId(progressData.lesson_id),
        completed: progressData.completed || false,
        created_at: new Date(),
        updated_at: new Date(),
        ...(progressData.completed && { completed_at: new Date() }),
      }

      const result = await progress.insertOne(newProgress)
      console.log("[v0] Created progress with ID:", result.insertedId)
      return { ...newProgress, _id: result.insertedId }
    } catch (error) {
      console.error("[v0] Error creating progress:", error)
      throw error
    }
  },

  async findByUser(userId: string) {
    try {
      const progress = await getCollection("progress")
      const progressList = await progress.find({ user_id: new ObjectId(userId) }).toArray()
      console.log("[v0] Found progress for user:", progressList.length)
      return progressList
    } catch (error) {
      console.error("[v0] Error finding progress by user:", error)
      return []
    }
  },

  async findByUserAndLesson(userId: string, lessonId: string) {
    try {
      const progress = await getCollection("progress")
      const userProgress = await progress.findOne({
        user_id: new ObjectId(userId),
        lesson_id: new ObjectId(lessonId),
      })
      console.log("[v0] Found progress for user and lesson:", !!userProgress)
      return userProgress
    } catch (error) {
      console.error("[v0] Error finding progress by user and lesson:", error)
      return null
    }
  },

  async markCompleted(userId: string, lessonId: string) {
    try {
      const progress = await getCollection("progress")
      const result = await progress.updateOne(
        { user_id: new ObjectId(userId), lesson_id: new ObjectId(lessonId) },
        {
          $set: {
            completed: true,
            completed_at: new Date(),
            updated_at: new Date(),
          },
        },
        { upsert: true },
      )
      console.log("[v0] Marked lesson completed, modified count:", result.modifiedCount)
      return result
    } catch (error) {
      console.error("[v0] Error marking lesson completed:", error)
      throw error
    }
  },
}

export const reviewOperations = {
  async create(reviewData: {
    user_id: string
    course_id: string
    rating: number
    comment?: string
  }) {
    try {
      const reviews = await getCollection("reviews")
      const newReview = {
        ...reviewData,
        user_id: new ObjectId(reviewData.user_id),
        course_id: new ObjectId(reviewData.course_id),
        created_at: new Date(),
        updated_at: new Date(),
      }

      const result = await reviews.insertOne(newReview)
      console.log("[v0] Created review with ID:", result.insertedId)
      return { ...newReview, _id: result.insertedId }
    } catch (error) {
      console.error("[v0] Error creating review:", error)
      throw error
    }
  },

  async findByCourse(courseId: string) {
    try {
      const reviews = await getCollection("reviews")
      const reviewsList = await reviews.find({ course_id: new ObjectId(courseId) }).toArray()
      console.log("[v0] Found reviews for course:", reviewsList.length)
      return reviewsList
    } catch (error) {
      console.error("[v0] Error finding reviews by course:", error)
      return []
    }
  },

  async findByUserAndCourse(userId: string, courseId: string) {
    try {
      const reviews = await getCollection("reviews")
      const review = await reviews.findOne({
        user_id: new ObjectId(userId),
        course_id: new ObjectId(courseId),
      })
      console.log("[v0] Found review for user and course:", !!review)
      return review
    } catch (error) {
      console.error("[v0] Error finding review by user and course:", error)
      return null
    }
  },
}

export const certificateOperations = {
  async create(certificateData: {
    user_id: string
    course_id: string
    certificate_url: string
  }) {
    try {
      const certificates = await getCollection("certificates")
      const newCertificate = {
        ...certificateData,
        user_id: new ObjectId(certificateData.user_id),
        course_id: new ObjectId(certificateData.course_id),
        issued_at: new Date(),
      }

      const result = await certificates.insertOne(newCertificate)
      console.log("[v0] Created certificate with ID:", result.insertedId)
      return { ...newCertificate, _id: result.insertedId }
    } catch (error) {
      console.error("[v0] Error creating certificate:", error)
      throw error
    }
  },

  async findByUser(userId: string) {
    try {
      const certificates = await getCollection("certificates")
      const certificatesList = await certificates.find({ user_id: new ObjectId(userId) }).toArray()
      console.log("[v0] Found certificates for user:", certificatesList.length)
      return certificatesList
    } catch (error) {
      console.error("[v0] Error finding certificates by user:", error)
      return []
    }
  },

  async findByUserAndCourse(userId: string, courseId: string) {
    try {
      const certificates = await getCollection("certificates")
      const certificate = await certificates.findOne({
        user_id: new ObjectId(userId),
        course_id: new ObjectId(courseId),
      })
      console.log("[v0] Found certificate for user and course:", !!certificate)
      return certificate
    } catch (error) {
      console.error("[v0] Error finding certificate by user and course:", error)
      return null
    }
  },
}
