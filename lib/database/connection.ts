import {
  userOperations,
  courseOperations,
  lessonOperations,
  enrollmentOperations,
  progressOperations,
  reviewOperations,
  certificateOperations,
  connectToDatabase,
} from "./mongodb"

// Check if we're using a real database or mock data
const isUsingMockData = !process.env.MONGODB_URI || process.env.MONGODB_URI.startsWith("local://")

export async function query<T = any>(collection: string, operation: string, params?: any): Promise<T[]> {
  if (isUsingMockData) {
    console.log("🔄 Using mock data for query:", collection, operation)
    return [] // Mock queries return empty arrays for now
  }

  try {
    // Route operations to appropriate MongoDB operations
    switch (collection) {
      case "users":
        return (await handleUserOperation(operation, params)) as T[]
      case "courses":
        return (await handleCourseOperation(operation, params)) as T[]
      case "lessons":
        return (await handleLessonOperation(operation, params)) as T[]
      case "enrollments":
        return (await handleEnrollmentOperation(operation, params)) as T[]
      case "progress":
        return (await handleProgressOperation(operation, params)) as T[]
      case "reviews":
        return (await handleReviewOperation(operation, params)) as T[]
      case "certificates":
        return (await handleCertificateOperation(operation, params)) as T[]
      default:
        console.warn(`Unknown collection: ${collection}`)
        return []
    }
  } catch (error) {
    console.error("Database operation error:", error)
    return []
  }
}

async function handleUserOperation(operation: string, params?: any) {
  switch (operation) {
    case "findByEmail":
      return await userOperations.findByEmail(params.email)
    case "create":
      return await userOperations.create(params)
    case "findById":
      return await userOperations.findById(params.id)
    case "updateById":
      return await userOperations.updateById(params.id, params.data)
    case "deleteById":
      return await userOperations.deleteById(params.id)
    default:
      return []
  }
}

async function handleCourseOperation(operation: string, params?: any) {
  switch (operation) {
    case "create":
      return await courseOperations.create(params)
    case "findById":
      return await courseOperations.findById(params.id)
    case "findByInstructor":
      return await courseOperations.findByInstructor(params.instructorId)
    case "findPublished":
      return await courseOperations.findPublished()
    case "updateById":
      return await courseOperations.updateById(params.id, params.data)
    case "deleteById":
      return await courseOperations.deleteById(params.id)
    default:
      return []
  }
}

async function handleLessonOperation(operation: string, params?: any) {
  switch (operation) {
    case "create":
      return await lessonOperations.create(params)
    case "findByCourse":
      return await lessonOperations.findByCourse(params.courseId)
    case "findById":
      return await lessonOperations.findById(params.id)
    case "updateById":
      return await lessonOperations.updateById(params.id, params.data)
    case "deleteById":
      return await lessonOperations.deleteById(params.id)
    default:
      return []
  }
}

async function handleEnrollmentOperation(operation: string, params?: any) {
  switch (operation) {
    case "create":
      return await enrollmentOperations.create(params)
    case "findByUser":
      return await enrollmentOperations.findByUser(params.userId)
    case "findByCourse":
      return await enrollmentOperations.findByCourse(params.courseId)
    case "findByUserAndCourse":
      return await enrollmentOperations.findByUserAndCourse(params.userId, params.courseId)
    case "updateProgress":
      return await enrollmentOperations.updateProgress(params.userId, params.courseId, params.progress)
    default:
      return []
  }
}

async function handleProgressOperation(operation: string, params?: any) {
  switch (operation) {
    case "create":
      return await progressOperations.create(params)
    case "findByUser":
      return await progressOperations.findByUser(params.userId)
    case "findByUserAndLesson":
      return await progressOperations.findByUserAndLesson(params.userId, params.lessonId)
    case "markCompleted":
      return await progressOperations.markCompleted(params.userId, params.lessonId)
    default:
      return []
  }
}

async function handleReviewOperation(operation: string, params?: any) {
  switch (operation) {
    case "create":
      return await reviewOperations.create(params)
    case "findByCourse":
      return await reviewOperations.findByCourse(params.courseId)
    case "findByUserAndCourse":
      return await reviewOperations.findByUserAndCourse(params.userId, params.courseId)
    default:
      return []
  }
}

async function handleCertificateOperation(operation: string, params?: any) {
  switch (operation) {
    case "create":
      return await certificateOperations.create(params)
    case "findByUser":
      return await certificateOperations.findByUser(params.userId)
    case "findByUserAndCourse":
      return await certificateOperations.findByUserAndCourse(params.userId, params.courseId)
    default:
      return []
  }
}

export async function queryOne<T = any>(collection: string, operation: string, params?: any): Promise<T | null> {
  const results = await query<T>(collection, operation, params)
  return Array.isArray(results) ? (results.length > 0 ? results[0] : null) : results
}

export async function queryMany<T = any>(collection: string, operation: string, params?: any): Promise<T[]> {
  const results = await query<T>(collection, operation, params)
  return Array.isArray(results) ? results : [results]
}

export const db = {
  query: async <T = any>(collection: string, operation: string, params?: any) => {
    try {
      const result = await query<T>(collection, operation, params)
      return { rows: Array.isArray(result) ? result : [result] }
    } catch (error) {
      console.error("Database query error:", error)
      return { rows: [] }
    }
  },
  queryOne: queryOne,
}

// Export MongoDB operations directly for advanced usage
export {
  userOperations,
  courseOperations,
  lessonOperations,
  enrollmentOperations,
  progressOperations,
  reviewOperations,
  certificateOperations,
  connectToDatabase,
}
