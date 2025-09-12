"use client"

import { useState, useEffect } from "react"
import { CourseCard } from "@/components/courses/course-card"
import { CourseFilters } from "@/components/courses/course-filters"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  thumbnail_url: string
  price: number
  difficulty_level: string
  category: string
  instructor_name: string
  instructor_avatar: string
  enrollment_count: number
  average_rating: number
  review_count: number
  duration: number
}

interface CoursesResponse {
  courses: Course[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    difficulty: "",
    priceRange: "",
    sortBy: "created_at",
  })

  const fetchCourses = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value)),
      })

      const response = await fetch(`/api/courses?${params}`)
      if (!response.ok) throw new Error("Failed to fetch courses")

      const data: CoursesResponse = await response.json()
      setCourses(data.courses)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses(1)
  }, [filters])

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  const handlePageChange = (page: number) => {
    fetchCourses(page)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Explore Courses</h1>
          <p className="text-muted-foreground">Discover thousands of courses from expert instructors</p>
        </div>

        <div className="mb-8">
          <CourseFilters onFiltersChange={handleFiltersChange} totalResults={pagination.total} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {courses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No courses found matching your criteria.</p>
                <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) => page === 1 || page === pagination.totalPages || Math.abs(page - pagination.page) <= 2,
                  )
                  .map((page, index, array) => (
                    <div key={page} className="flex items-center">
                      {index > 0 && array[index - 1] !== page - 1 && <span className="px-2">...</span>}
                      <Button
                        variant={page === pagination.page ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    </div>
                  ))}

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
