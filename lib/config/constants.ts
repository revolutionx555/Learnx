// Application constants and configuration
export const APP_CONSTANTS = {
  // Application Info
  APP_NAME: "Learn X",
  APP_DESCRIPTION: "Professional learning management system",
  APP_VERSION: "1.0.0",

  // File Upload Limits
  MAX_FILE_SIZE: {
    VIDEO: 500 * 1024 * 1024, // 500MB
    IMAGE: 5 * 1024 * 1024, // 5MB
    DOCUMENT: 10 * 1024 * 1024, // 10MB
    CV: 5 * 1024 * 1024, // 5MB
  },

  // Supported File Types
  ALLOWED_FILE_TYPES: {
    VIDEO: ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"],
    IMAGE: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    DOCUMENT: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ],
  },

  // Course Configuration
  COURSE: {
    MIN_TITLE_LENGTH: 5,
    MAX_TITLE_LENGTH: 100,
    MIN_DESCRIPTION_LENGTH: 20,
    MAX_DESCRIPTION_LENGTH: 2000,
    MIN_SHORT_DESCRIPTION_LENGTH: 10,
    MAX_SHORT_DESCRIPTION_LENGTH: 100,
    MIN_PRICE: 0,
    MAX_PRICE: 9999,
  },

  // User Configuration
  USER: {
    MIN_PASSWORD_LENGTH: 8,
    MIN_BIO_LENGTH: 100,
    MAX_BIO_LENGTH: 1000,
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 12,
    MAX_PAGE_SIZE: 50,
    COURSES_PER_PAGE: 12,
    LESSONS_PER_PAGE: 20,
    STUDENTS_PER_PAGE: 25,
  },

  // Video Configuration
  VIDEO: {
    DEFAULT_QUALITY: "720p",
    SUPPORTED_QUALITIES: ["360p", "480p", "720p", "1080p"],
    DEFAULT_PLAYBACK_RATE: 1,
    SUPPORTED_PLAYBACK_RATES: [0.5, 0.75, 1, 1.25, 1.5, 2],
  },

  // Email Templates
  EMAIL_TEMPLATES: {
    WELCOME: "welcome",
    COURSE_ENROLLMENT: "course-enrollment",
    INSTRUCTOR_APPLICATION: "instructor-application",
    COURSE_COMPLETION: "course-completion",
    PASSWORD_RESET: "password-reset",
  },

  // Storage Buckets
  STORAGE_BUCKETS: {
    COURSE_VIDEOS: "course-videos",
    COURSE_IMAGES: "course-images",
    COURSE_DOCUMENTS: "course-documents",
    INSTRUCTOR_DOCUMENTS: "instructor-documents",
    USER_AVATARS: "user-avatars",
  },

  // API Rate Limits
  RATE_LIMITS: {
    DEFAULT: 100, // requests per minute
    AUTH: 5, // login attempts per minute
    UPLOAD: 10, // file uploads per minute
    EMAIL: 20, // emails per hour
  },

  // Cache TTL (in seconds)
  CACHE_TTL: {
    COURSES: 300, // 5 minutes
    USER_PROFILE: 600, // 10 minutes
    COURSE_CONTENT: 1800, // 30 minutes
    STATIC_CONTENT: 3600, // 1 hour
  },

  // Feature Flags
  FEATURES: {
    COURSE_REVIEWS: true,
    COURSE_DISCUSSIONS: true,
    LIVE_SESSIONS: false,
    MOBILE_APP: false,
    CERTIFICATES: true,
    ANALYTICS: true,
  },
} as const

// Course categories
export const COURSE_CATEGORIES = [
  "programming",
  "design",
  "business",
  "marketing",
  "data-science",
  "photography",
  "music",
  "language",
  "health-fitness",
  "personal-development",
] as const

// Difficulty levels
export const DIFFICULTY_LEVELS = ["beginner", "intermediate", "advanced"] as const

// User roles
export const USER_ROLES = ["student", "instructor", "admin"] as const

// Course statuses
export const COURSE_STATUSES = ["draft", "published", "archived"] as const

// Enrollment statuses
export const ENROLLMENT_STATUSES = ["active", "completed", "cancelled"] as const

// Payment statuses
export const PAYMENT_STATUSES = ["pending", "completed", "failed", "refunded"] as const

export type CourseCategory = (typeof COURSE_CATEGORIES)[number]
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number]
export type UserRole = (typeof USER_ROLES)[number]
export type CourseStatus = (typeof COURSE_STATUSES)[number]
export type EnrollmentStatus = (typeof ENROLLMENT_STATUSES)[number]
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]
