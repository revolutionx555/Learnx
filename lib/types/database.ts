// Database Types for Learn X LMS - MongoDB Version

export interface User {
  _id?: string
  id?: string
  email: string
  password_hash?: string
  name: string
  role: "student" | "instructor" | "admin"
  avatar_url?: string
  bio?: string
  email_verified: boolean
  created_at: Date
  updated_at: Date
}

export interface Course {
  _id?: string
  id?: string
  title: string
  description?: string
  instructor_id: string
  price: number
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: number
  thumbnail_url?: string
  status: "draft" | "published" | "archived"
  created_at: Date
  updated_at: Date
}

export interface Lesson {
  _id?: string
  id?: string
  course_id: string
  title: string
  description?: string
  video_url?: string
  content?: string
  duration: number
  order_index: number
  is_free: boolean
  created_at: Date
  updated_at: Date
}

export interface Enrollment {
  _id?: string
  id?: string
  user_id: string
  course_id: string
  progress: number
  completed_at?: Date
  created_at: Date
  updated_at: Date
}

export interface Progress {
  _id?: string
  id?: string
  user_id: string
  lesson_id: string
  completed: boolean
  completed_at?: Date
  created_at: Date
  updated_at: Date
}

export interface Review {
  _id?: string
  id?: string
  user_id: string
  course_id: string
  rating: number
  comment?: string
  created_at: Date
  updated_at: Date
}

export interface Certificate {
  _id?: string
  id?: string
  user_id: string
  course_id: string
  certificate_url: string
  issued_at: Date
}

export interface InstructorApplication {
  _id?: string
  id?: string
  email: string
  name: string
  bio: string
  expertise: string
  experience: string
  linkedin?: string
  website?: string
  cv_url?: string
  status: "pending" | "approved" | "rejected"
  applied_at: Date
  reviewed_at?: Date
  reviewed_by?: string
}

// Extended types with relations
export interface CourseWithDetails extends Course {
  instructor: Pick<User, "_id" | "id" | "name" | "avatar_url">
  enrollment_count: number
  average_rating: number
  review_count: number
}

export interface EnrollmentWithCourse extends Enrollment {
  course: Course
}

export interface UserProfile extends Omit<User, "password_hash"> {
  enrollments?: EnrollmentWithCourse[]
  certificates?: Certificate[]
}
