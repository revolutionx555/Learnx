// Production-ready data utilities for Learn X LMS
import type { Category } from "../types/database"

// This file now serves as a utility for production fallbacks rather than mock data
// The actual data will come from Supabase when properly configured

export const defaultCategories: Category[] = [
  {
    id: "web-dev",
    name: "Web Development",
    slug: "web-development",
    description: "Learn modern web development technologies and frameworks",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "data-science",
    name: "Data Science",
    slug: "data-science",
    description: "Master data analysis, machine learning, and AI",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "mobile-dev",
    name: "Mobile Development",
    slug: "mobile-development",
    description: "Build native and cross-platform mobile applications",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "design",
    name: "Design",
    slug: "design",
    description: "UI/UX design, graphic design, and creative skills",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "business",
    name: "Business",
    slug: "business",
    description: "Entrepreneurship, marketing, and business strategy",
    created_at: new Date(),
    updated_at: new Date(),
  },
]

export const mockData = {
  categories: defaultCategories,
  users: [],
  courses: [],
  lessons: [],
  enrollments: [],
  certificates: [],
  reviews: [],
}

// Helper functions for production use
export const getDefaultWelcomeMessage = (userRole: string) => {
  switch (userRole) {
    case "instructor":
      return "Welcome to your instructor dashboard! Create your first course to start teaching."
    case "student":
      return "Welcome to Learn X! Browse our course catalog to begin your learning journey."
    default:
      return "Welcome to Learn X!"
  }
}

export const getEmptyStateMessage = (context: string) => {
  const messages = {
    courses: "No courses available yet. Check back soon for new content!",
    enrollments: "You haven't enrolled in any courses yet. Browse our catalog to get started.",
    certificates: "Complete courses to earn certificates and showcase your achievements.",
    analytics: "Analytics will appear once you have learning activity to track.",
    revenue: "Revenue data will be available after your first course sales.",
    students: "Student data will appear once learners enroll in your courses.",
  }
  return messages[context as keyof typeof messages] || "No data available yet."
}

// Production-ready course difficulty levels
export const difficultyLevels = [
  { value: "beginner", label: "Beginner", description: "No prior experience required" },
  { value: "intermediate", label: "Intermediate", description: "Some experience recommended" },
  { value: "advanced", label: "Advanced", description: "Extensive experience required" },
  { value: "expert", label: "Expert", description: "Professional-level expertise" },
]

// Course duration ranges for filtering
export const durationRanges = [
  { value: "short", label: "Short (< 5 hours)", min: 0, max: 5 },
  { value: "medium", label: "Medium (5-20 hours)", min: 5, max: 20 },
  { value: "long", label: "Long (20+ hours)", min: 20, max: 999 },
]

// Price ranges for course filtering
export const priceRanges = [
  { value: "free", label: "Free", min: 0, max: 0 },
  { value: "budget", label: "Budget ($1-$50)", min: 1, max: 50 },
  { value: "standard", label: "Standard ($51-$150)", min: 51, max: 150 },
  { value: "premium", label: "Premium ($150+)", min: 150, max: 9999 },
]
