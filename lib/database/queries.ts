// Database query helpers for common operations
import { queryOne, queryMany } from "./connection"
import type {
  User,
  Course,
  CourseWithDetails,
  Enrollment,
  Category,
  Discussion,
  DiscussionReply,
} from "../types/database"
import { randomUUID } from "crypto"

// User queries - adapted for users_sync table
export const userQueries = {
  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await queryOne<any>("SELECT * FROM users_sync WHERE email = $1 AND deleted_at IS NULL", [email])
      if (!result) return null

      return {
        id: result.id,
        email: result.email,
        password_hash: result.raw_json?.password_hash || "",
        first_name: result.name?.split(" ")[0] || "",
        last_name: result.name?.split(" ").slice(1).join(" ") || "",
        role: result.raw_json?.role || "student",
        avatar_url: result.raw_json?.avatar_url || null,
        bio: result.raw_json?.bio || null,
        is_verified: result.raw_json?.is_verified || false,
        is_active: true,
        created_at: result.created_at,
        updated_at: result.updated_at,
      } as User
    } catch (error) {
      console.error("Error finding user by email:", error)
      throw error
    }
  },

  async findById(id: string): Promise<User | null> {
    try {
      const result = await queryOne<any>("SELECT * FROM users_sync WHERE id = $1 AND deleted_at IS NULL", [id])
      if (!result) return null

      return {
        id: result.id,
        email: result.email,
        password_hash: result.raw_json?.password_hash || "",
        first_name: result.name?.split(" ")[0] || "",
        last_name: result.name?.split(" ").slice(1).join(" ") || "",
        role: result.raw_json?.role || "student",
        avatar_url: result.raw_json?.avatar_url || null,
        bio: result.raw_json?.bio || null,
        is_verified: result.raw_json?.is_verified || false,
        is_active: true,
        created_at: result.created_at,
        updated_at: result.updated_at,
      } as User
    } catch (error) {
      console.error("Error finding user by ID:", error)
      throw error
    }
  },

  async create(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
    try {
      const userId = randomUUID()
      const fullName = `${userData.first_name} ${userData.last_name}`.trim()
      const rawJson = {
        password_hash: userData.password_hash,
        role: userData.role,
        avatar_url: userData.avatar_url,
        bio: userData.bio,
        is_verified: userData.is_verified,
        is_active: userData.is_active,
      }

      console.log("Creating user with data:", { userId, email: userData.email, fullName, rawJson })

      const result = await queryOne<any>(
        `INSERT INTO users_sync (id, email, name, raw_json, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING *`,
        [userId, userData.email, fullName, JSON.stringify(rawJson)],
      )

      if (!result) {
        throw new Error("Failed to create user - no result returned")
      }

      return {
        id: result.id,
        email: result.email,
        password_hash: userData.password_hash,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        avatar_url: userData.avatar_url,
        bio: userData.bio,
        is_verified: userData.is_verified,
        is_active: userData.is_active,
        created_at: result.created_at,
        updated_at: result.updated_at,
      } as User
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  },

  async updateProfile(
    id: string,
    updates: Partial<Pick<User, "first_name" | "last_name" | "bio" | "avatar_url">>,
  ): Promise<User | null> {
    const current = await this.findById(id)
    if (!current) return null

    const updatedName =
      updates.first_name || updates.last_name
        ? `${updates.first_name || current.first_name} ${updates.last_name || current.last_name}`.trim()
        : undefined

    const updatedRawJson = {
      ...JSON.parse((await queryOne<any>("SELECT raw_json FROM users_sync WHERE id = $1", [id]))?.raw_json || "{}"),
      bio: updates.bio !== undefined ? updates.bio : current.bio,
      avatar_url: updates.avatar_url !== undefined ? updates.avatar_url : current.avatar_url,
    }

    const updateFields = []
    const values = [id]
    let paramIndex = 2

    if (updatedName) {
      updateFields.push(`name = $${paramIndex}`)
      values.push(updatedName)
      paramIndex++
    }

    updateFields.push(`raw_json = $${paramIndex}`)
    values.push(JSON.stringify(updatedRawJson))
    paramIndex++

    updateFields.push(`updated_at = NOW()`)

    const result = await queryOne<any>(
      `UPDATE users_sync SET ${updateFields.join(", ")} WHERE id = $1 RETURNING *`,
      values,
    )

    if (!result) return null

    return {
      id: result.id,
      email: result.email,
      password_hash: current.password_hash,
      first_name: updates.first_name || current.first_name,
      last_name: updates.last_name || current.last_name,
      role: current.role,
      avatar_url: updates.avatar_url !== undefined ? updates.avatar_url : current.avatar_url,
      bio: updates.bio !== undefined ? updates.bio : current.bio,
      is_verified: current.is_verified,
      is_active: current.is_active,
      created_at: result.created_at,
      updated_at: result.updated_at,
    } as User
  },
}

export const courseQueries = {
  async findPublished(): Promise<Course[]> {
    try {
      const courses = await queryMany<any>(`
        SELECT c.*, u.name as instructor_name, u.raw_json->>'avatar_url' as instructor_avatar,
               COUNT(e.id) as enrollment_count,
               AVG(r.rating) as average_rating,
               COUNT(r.id) as review_count
        FROM courses c
        LEFT JOIN users_sync u ON c.instructor_id = u.id
        LEFT JOIN enrollments e ON c.id = e.course_id
        LEFT JOIN reviews r ON c.id = r.course_id
        WHERE c.is_published = true AND c.deleted_at IS NULL
        GROUP BY c.id, u.name, u.raw_json
        ORDER BY c.created_at DESC
      `)

      return courses.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        short_description: course.short_description,
        thumbnail_url: course.thumbnail_url,
        price: Number.parseFloat(course.price) || 0,
        difficulty_level: course.difficulty_level,
        category: course.category || "General",
        instructor_id: course.instructor_id,
        instructor_name: course.instructor_name || "Unknown",
        instructor_avatar: course.instructor_avatar,
        enrollment_count: Number.parseInt(course.enrollment_count) || 0,
        average_rating: Number.parseFloat(course.average_rating) || 0,
        review_count: Number.parseInt(course.review_count) || 0,
        duration: course.duration_minutes || 0,
        is_published: course.is_published,
        is_featured: course.is_featured,
        created_at: course.created_at,
        updated_at: course.updated_at,
      }))
    } catch (error) {
      console.error("Error finding published courses:", error)
      return []
    }
  },

  async findByInstructor(instructorId: string): Promise<Course[]> {
    try {
      const courses = await queryMany<any>(
        `
        SELECT c.*, COUNT(e.id) as enrollment_count,
               AVG(r.rating) as average_rating,
               COUNT(r.id) as review_count
        FROM courses c
        LEFT JOIN enrollments e ON c.id = e.course_id
        LEFT JOIN reviews r ON c.id = r.course_id
        WHERE c.instructor_id = $1 AND c.deleted_at IS NULL
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `,
        [instructorId],
      )

      return courses.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        short_description: course.short_description,
        thumbnail_url: course.thumbnail_url,
        price: Number.parseFloat(course.price) || 0,
        difficulty_level: course.difficulty_level,
        category: course.category || "General",
        instructor_id: course.instructor_id,
        enrollment_count: Number.parseInt(course.enrollment_count) || 0,
        average_rating: Number.parseFloat(course.average_rating) || 0,
        review_count: Number.parseInt(course.review_count) || 0,
        duration: course.duration_minutes || 0,
        is_published: course.is_published,
        is_featured: course.is_featured,
        created_at: course.created_at,
        updated_at: course.updated_at,
      }))
    } catch (error) {
      console.error("Error finding instructor courses:", error)
      return []
    }
  },

  async findBySlug(slug: string): Promise<CourseWithDetails | null> {
    try {
      const course = await queryOne<any>(
        `
        SELECT c.*, u.name as instructor_name, u.raw_json->>'avatar_url' as instructor_avatar,
               u.raw_json->>'bio' as instructor_bio,
               COUNT(e.id) as enrollment_count,
               AVG(r.rating) as average_rating,
               COUNT(r.id) as review_count
        FROM courses c
        LEFT JOIN users_sync u ON c.instructor_id = u.id
        LEFT JOIN enrollments e ON c.id = e.course_id
        LEFT JOIN reviews r ON c.id = r.course_id
        WHERE c.slug = $1 AND c.deleted_at IS NULL
        GROUP BY c.id, u.name, u.raw_json
      `,
        [slug],
      )

      if (!course) return null

      return {
        ...course,
        enrollment_count: Number.parseInt(course.enrollment_count) || 0,
        average_rating: Number.parseFloat(course.average_rating) || 0,
        review_count: Number.parseInt(course.review_count) || 0,
        price: Number.parseFloat(course.price) || 0,
      }
    } catch (error) {
      console.error("Error finding course by slug:", error)
      return null
    }
  },

  async create(courseData: {
    title: string
    description?: string
    short_description?: string
    category?: string
    price: number
    difficulty_level: string
    instructor_id: string
    thumbnail_url?: string
  }): Promise<Course> {
    try {
      const courseId = randomUUID()
      const slug = courseData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      const result = await queryOne<any>(
        `
        INSERT INTO courses (
          id, title, description, short_description, slug, category,
          price, difficulty_level, instructor_id, thumbnail_url,
          is_published, is_featured, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, false, false, NOW(), NOW())
        RETURNING *
      `,
        [
          courseId,
          courseData.title,
          courseData.description,
          courseData.short_description,
          slug,
          courseData.category,
          courseData.price,
          courseData.difficulty_level,
          courseData.instructor_id,
          courseData.thumbnail_url,
        ],
      )

      if (!result) throw new Error("Failed to create course")

      return {
        id: result.id,
        title: result.title,
        description: result.description,
        short_description: result.short_description,
        thumbnail_url: result.thumbnail_url,
        price: Number.parseFloat(result.price) || 0,
        difficulty_level: result.difficulty_level,
        category: result.category,
        instructor_id: result.instructor_id,
        enrollment_count: 0,
        average_rating: 0,
        review_count: 0,
        duration: result.duration_minutes || 0,
        is_published: result.is_published,
        is_featured: result.is_featured,
        created_at: result.created_at,
        updated_at: result.updated_at,
      }
    } catch (error) {
      console.error("Error creating course:", error)
      throw error
    }
  },

  async update(courseId: string, updates: Partial<Course>): Promise<Course | null> {
    try {
      const updateFields = []
      const values = [courseId]
      let paramIndex = 2

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && key !== "id" && key !== "created_at") {
          updateFields.push(`${key} = $${paramIndex}`)
          values.push(value)
          paramIndex++
        }
      })

      if (updateFields.length === 0) return null

      updateFields.push(`updated_at = NOW()`)

      const result = await queryOne<any>(
        `
        UPDATE courses SET ${updateFields.join(", ")}
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *
      `,
        values,
      )

      if (!result) return null

      return {
        id: result.id,
        title: result.title,
        description: result.description,
        short_description: result.short_description,
        thumbnail_url: result.thumbnail_url,
        price: Number.parseFloat(result.price) || 0,
        difficulty_level: result.difficulty_level,
        category: result.category,
        instructor_id: result.instructor_id,
        enrollment_count: 0,
        average_rating: 0,
        review_count: 0,
        duration: result.duration_minutes || 0,
        is_published: result.is_published,
        is_featured: result.is_featured,
        created_at: result.created_at,
        updated_at: result.updated_at,
      }
    } catch (error) {
      console.error("Error updating course:", error)
      throw error
    }
  },

  async delete(courseId: string): Promise<boolean> {
    try {
      const result = await queryOne<any>(
        `
        UPDATE courses SET deleted_at = NOW()
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING id
      `,
        [courseId],
      )

      return !!result
    } catch (error) {
      console.error("Error deleting course:", error)
      return false
    }
  },
}

export const enrollmentQueries = {
  async findByUserAndCourse(userId: string, courseId: string): Promise<Enrollment | null> {
    return null
  },

  async findByUser(userId: string): Promise<Enrollment[]> {
    return []
  },

  async create(userId: string, courseId: string): Promise<Enrollment> {
    throw new Error("Enrollment not available - database tables not set up")
  },

  async updateProgress(userId: string, courseId: string, progressPercentage: number): Promise<void> {
    // No-op for now
  },
}

export const categoryQueries = {
  async findAll(): Promise<Category[]> {
    return []
  },

  async findBySlug(slug: string): Promise<Category | null> {
    return null
  },
}

export const discussionQueries = {
  async createDiscussion(discussionData: {
    courseId: string
    userId: string
    title: string
    content: string
  }): Promise<Discussion> {
    try {
      const discussionId = randomUUID()
      const result = await queryOne<any>(
        `
        INSERT INTO discussions (id, course_id, user_id, title, content, is_pinned, reply_count, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, false, 0, NOW(), NOW())
        RETURNING *
      `,
        [discussionId, discussionData.courseId, discussionData.userId, discussionData.title, discussionData.content],
      )

      return result
    } catch (error) {
      console.error("Error creating discussion:", error)
      throw error
    }
  },

  async getDiscussionsByCourse(courseId: string): Promise<Discussion[]> {
    try {
      const discussions = await queryMany<any>(
        `
        SELECT d.*, u.name as user_name, u.raw_json->>'avatar_url' as user_avatar
        FROM discussions d
        LEFT JOIN users_sync u ON d.user_id = u.id
        WHERE d.course_id = $1
        ORDER BY d.is_pinned DESC, d.created_at DESC
      `,
        [courseId],
      )

      return discussions.map((discussion) => ({
        id: discussion.id,
        title: discussion.title,
        content: discussion.content,
        user: {
          first_name: discussion.user_name?.split(" ")[0] || "Unknown",
          last_name: discussion.user_name?.split(" ").slice(1).join(" ") || "",
          avatar_url: discussion.user_avatar,
        },
        reply_count: discussion.reply_count || 0,
        created_at: discussion.created_at,
        is_pinned: discussion.is_pinned,
      }))
    } catch (error) {
      console.error("Error getting discussions by course:", error)
      return []
    }
  },

  async createDiscussionReply(replyData: {
    discussionId: string
    userId: string
    content: string
    parentReplyId?: string
  }): Promise<DiscussionReply> {
    try {
      const replyId = randomUUID()
      const result = await queryOne<any>(
        `
        INSERT INTO discussion_replies (id, discussion_id, user_id, content, parent_reply_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING *
      `,
        [replyId, replyData.discussionId, replyData.userId, replyData.content, replyData.parentReplyId || null],
      )

      // Update reply count in discussions table
      await queryOne<any>(
        `
        UPDATE discussions 
        SET reply_count = reply_count + 1, updated_at = NOW()
        WHERE id = $1
      `,
        [replyData.discussionId],
      )

      return result
    } catch (error) {
      console.error("Error creating discussion reply:", error)
      throw error
    }
  },

  async getDiscussionReplies(discussionId: string): Promise<DiscussionReply[]> {
    try {
      const replies = await queryMany<any>(
        `
        SELECT dr.*, u.name as user_name, u.raw_json->>'avatar_url' as user_avatar
        FROM discussion_replies dr
        LEFT JOIN users_sync u ON dr.user_id = u.id
        WHERE dr.discussion_id = $1
        ORDER BY dr.created_at ASC
      `,
        [discussionId],
      )

      return replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        user: {
          first_name: reply.user_name?.split(" ")[0] || "Unknown",
          last_name: reply.user_name?.split(" ").slice(1).join(" ") || "",
          avatar_url: reply.user_avatar,
        },
        parent_reply_id: reply.parent_reply_id,
        created_at: reply.created_at,
      }))
    } catch (error) {
      console.error("Error getting discussion replies:", error)
      return []
    }
  },
}

export async function getUserById(id: string) {
  return await userQueries.findById(id)
}

export async function getQuizById(id: string) {
  try {
    const result = await queryOne<any>("SELECT * FROM quizzes WHERE id = $1 AND deleted_at IS NULL", [id])
    return result
  } catch (error) {
    console.error("Error getting quiz by ID:", error)
    return null
  }
}

export async function getQuizAnalytics(quizId: string) {
  try {
    const analytics = await queryOne<any>(
      `
      SELECT 
        COUNT(qs.id) as total_submissions,
        AVG(qs.score) as average_score,
        MAX(qs.score) as highest_score,
        MIN(qs.score) as lowest_score,
        COUNT(DISTINCT qs.user_id) as unique_users
      FROM quiz_submissions qs
      WHERE qs.quiz_id = $1
    `,
      [quizId],
    )

    return (
      analytics || {
        total_submissions: 0,
        average_score: 0,
        highest_score: 0,
        lowest_score: 0,
        unique_users: 0,
      }
    )
  } catch (error) {
    console.error("Error getting quiz analytics:", error)
    return {
      total_submissions: 0,
      average_score: 0,
      highest_score: 0,
      lowest_score: 0,
      unique_users: 0,
    }
  }
}

export async function createQuizSubmission(submissionData: {
  quiz_id: string
  user_id: string
  answers: any[]
  score: number
  completed_at: Date
}) {
  try {
    const submissionId = randomUUID()
    const result = await queryOne<any>(
      `
      INSERT INTO quiz_submissions (id, quiz_id, user_id, answers, score, completed_at, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `,
      [
        submissionId,
        submissionData.quiz_id,
        submissionData.user_id,
        JSON.stringify(submissionData.answers),
        submissionData.score,
        submissionData.completed_at,
      ],
    )

    return result
  } catch (error) {
    console.error("Error creating quiz submission:", error)
    throw error
  }
}

export async function getQuizSubmissions(quizId: string) {
  try {
    const submissions = await queryMany<any>(
      `
      SELECT qs.*, u.name as user_name, u.email as user_email
      FROM quiz_submissions qs
      LEFT JOIN users_sync u ON qs.user_id = u.id
      WHERE qs.quiz_id = $1
      ORDER BY qs.created_at DESC
    `,
      [quizId],
    )

    return submissions
  } catch (error) {
    console.error("Error getting quiz submissions:", error)
    return []
  }
}

export async function createDiscussion(discussionData: {
  courseId: string
  userId: string
  title: string
  content: string
}) {
  return await discussionQueries.createDiscussion(discussionData)
}

export async function getDiscussionsByCourse(courseId: string) {
  return await discussionQueries.getDiscussionsByCourse(courseId)
}
