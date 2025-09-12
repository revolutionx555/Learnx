// API Request/Response Types for Learn X LMS

// Authentication
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  role?: "student" | "instructor"
}

export interface AuthResponse {
  user: any // Placeholder for UserProfile
  token: string
  refresh_token: string
}

// Course Management
export interface CreateCourseRequest {
  title: string
  description?: string
  short_description?: string
  category_id?: string
  price: number
  level: "beginner" | "intermediate" | "advanced"
  thumbnail_url?: string
  trailer_video_url?: string
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  is_published?: boolean
  is_featured?: boolean
}

export interface CourseFilters {
  category?: string
  level?: string
  price_min?: number
  price_max?: number
  rating_min?: number
  search?: string
  instructor_id?: string
  is_featured?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface CoursesResponse extends PaginatedResponse<any> {} // Placeholder for CourseWithDetails

// Lesson Management
export interface CreateLessonRequest {
  title: string
  description?: string
  content_type: "video" | "audio" | "document" | "quiz" | "assignment"
  content_url?: string
  duration_minutes: number
  is_preview?: boolean
  is_required?: boolean
}

export interface UpdateLessonRequest extends Partial<CreateLessonRequest> {}

// Quiz Management
export interface CreateQuizRequest {
  title: string
  description?: string
  time_limit_minutes?: number
  passing_score: number
  max_attempts: number
  is_randomized?: boolean
  questions: CreateQuizQuestionRequest[]
}

export interface CreateQuizQuestionRequest {
  question_text: string
  question_type: "multiple_choice" | "true_false" | "short_answer" | "essay"
  points: number
  explanation?: string
  options?: CreateQuizOptionRequest[]
}

export interface CreateQuizOptionRequest {
  option_text: string
  is_correct: boolean
}

export interface SubmitQuizRequest {
  answers: {
    question_id: string
    selected_option_id?: string
    answer_text?: string
  }[]
}

export interface QuizResultResponse {
  attempt_id: string
  score: number
  max_score: number
  is_passed: boolean
  time_taken_minutes: number
  answers: {
    question_id: string
    is_correct: boolean
    points_earned: number
    correct_answer?: string
    explanation?: string
  }[]
}

// Progress Tracking
export interface UpdateProgressRequest {
  lesson_id: string
  completion_percentage: number
  time_spent_minutes: number
}

export interface ProgressResponse {
  course_progress: number
  completed_lessons: number
  total_lessons: number
  time_spent_minutes: number
  last_accessed_lesson?: string
}

// Reviews
export interface CreateReviewRequest {
  rating: number
  review_text?: string
}

export interface UpdateReviewRequest extends Partial<CreateReviewRequest> {}

// Discussions
export interface CreateDiscussionRequest {
  title: string
  content: string
}

export interface CreateReplyRequest {
  content: string
  parent_reply_id?: string
}

// Analytics (for instructors/admins)
export interface CourseAnalytics {
  total_enrollments: number
  completion_rate: number
  average_rating: number
  total_revenue: number
  enrollment_trend: {
    date: string
    count: number
  }[]
  popular_lessons: {
    lesson_id: string
    title: string
    completion_rate: number
  }[]
}

export interface UserAnalytics {
  total_courses_enrolled: number
  total_courses_completed: number
  total_certificates: number
  total_time_spent_minutes: number
  learning_streak_days: number
  favorite_categories: {
    category: string
    course_count: number
  }[]
}

// Error Response
export interface ErrorResponse {
  error: string
  message: string
  details?: any
}

// Success Response
export interface SuccessResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}

// Placeholder declarations for undeclared variables
type UserProfile = {}

type CourseWithDetails = {}
