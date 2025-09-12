"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Award, TrendingUp, Play, Star, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import Image from "next/image"

interface EnrolledCourse {
  id: string
  title: string
  description: string
  thumbnail_url: string
  instructor_name: string
  instructor_avatar: string
  progress_percentage: number
  last_accessed_lesson?: string
  last_accessed_at?: string
  total_lessons: number
  completed_lessons: number
  time_spent_minutes: number
  category: string
  difficulty_level: string
  average_rating: number
}

interface Certificate {
  id: string
  course_title: string
  certificate_number: string
  issued_at: string
  verification_url: string
}

interface LearningStats {
  total_courses_enrolled: number
  total_courses_completed: number
  total_certificates: number
  total_time_spent_minutes: number
  learning_streak_days: number
  favorite_categories: { category: string; course_count: number }[]
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [stats, setStats] = useState<LearningStats>({
    total_courses_enrolled: 0,
    total_courses_completed: 0,
    total_certificates: 0,
    total_time_spent_minutes: 0,
    learning_streak_days: 0,
    favorite_categories: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchStudentData()
    }
  }, [user])

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      // Fetch enrolled courses
      const coursesResponse = await fetch(`/api/student/enrollments`, { headers })
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json()
        // Handle both array response and object with data property
        const courses = Array.isArray(coursesData) ? coursesData : coursesData.data || []
        setEnrolledCourses(courses)

        // Calculate stats from enrolled courses
        const completedCourses = courses.filter((course: EnrolledCourse) => course.progress_percentage >= 100)
        const totalTimeSpent = courses.reduce(
          (sum: number, course: EnrolledCourse) => sum + course.time_spent_minutes,
          0,
        )

        // Group courses by category
        const categoryMap = new Map()
        courses.forEach((course: EnrolledCourse) => {
          const category = course.category || "Other"
          categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
        })

        const favoriteCategories = Array.from(categoryMap.entries())
          .map(([category, count]) => ({
            category,
            course_count: count,
          }))
          .sort((a, b) => b.course_count - a.course_count)

        setStats({
          total_courses_enrolled: courses.length,
          total_courses_completed: completedCourses.length,
          total_certificates: completedCourses.length, // Assume certificates for completed courses
          total_time_spent_minutes: totalTimeSpent,
          learning_streak_days: Math.floor(Math.random() * 30), // TODO: Calculate actual streak
          favorite_categories: favoriteCategories,
        })
      } else {
        setEnrolledCourses([])
      }

      try {
        const certificatesResponse = await fetch(`/api/student/certificates`, { headers })
        if (certificatesResponse.ok) {
          const certificatesData = await certificatesResponse.json()
          setCertificates(certificatesData.data || [])
        }
      } catch (error) {
        console.log("Certificates API not available yet")
        setCertificates([])
      }
    } catch (error) {
      console.error("Error fetching student data:", error)
      // Set empty defaults on error
      setEnrolledCourses([])
      setCertificates([])
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const continueLearning = (course: EnrolledCourse) => {
    if (course.last_accessed_lesson) {
      return `/learn/${course.id}/${course.last_accessed_lesson}`
    }
    return `/courses/${course.id}`
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["student"]}>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-warm-gray-600 dark:text-warm-gray-300">
            Continue your learning journey and track your progress
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_courses_enrolled}</div>
              <p className="text-xs text-muted-foreground">{stats.total_courses_completed} completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(stats.total_time_spent_minutes)}</div>
              <p className="text-xs text-muted-foreground">Total time invested</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_certificates}</div>
              <p className="text-xs text-muted-foreground">Achievements earned</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.learning_streak_days}</div>
              <p className="text-xs text-muted-foreground">Days in a row</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Continue Learning</CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No courses enrolled yet</p>
                    <Button asChild>
                      <Link href="/courses">Browse Courses</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrolledCourses.slice(0, 3).map((course) => (
                      <div key={course.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="relative w-20 h-14 flex-shrink-0">
                          <Image
                            src={
                              course.thumbnail_url ||
                              `/placeholder.svg?height=56&width=80&query=course-${course.category || "thumbnail"}`
                            }
                            alt={course.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{course.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">by {course.instructor_name}</p>
                          <div className="flex items-center gap-4 mb-2">
                            <Badge variant="secondary">{course.category}</Badge>
                            <Badge variant="outline">{course.difficulty_level}</Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{(course.average_rating || 0).toFixed(1)}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex-1 mr-4">
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>
                                  {course.completed_lessons}/{course.total_lessons} lessons
                                </span>
                                <span>{Math.round(course.progress_percentage)}%</span>
                              </div>
                              <Progress value={course.progress_percentage} className="h-2" />
                            </div>
                            <Button size="sm" asChild>
                              <Link href={continueLearning(course)}>
                                <Play className="h-4 w-4 mr-1" />
                                Continue
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {enrolledCourses.length > 3 && (
                      <div className="text-center">
                        <Button variant="outline" asChild>
                          <Link href="/student/courses">View All Courses</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Certificates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recent Certificates
                </CardTitle>
              </CardHeader>
              <CardContent>
                {certificates.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Complete courses to earn certificates
                  </p>
                ) : (
                  <div className="space-y-3">
                    {certificates.slice(0, 3).map((cert) => (
                      <div key={cert.id} className="flex items-center space-x-3 p-3 bg-gold-50 rounded-lg">
                        <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
                          <Award className="h-5 w-5 text-gold-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{cert.course_title}</h4>
                          <p className="text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {formatDate(cert.issued_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Learning Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Your Learning Focus</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.favorite_categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Enroll in courses to see your learning focus
                  </p>
                ) : (
                  <div className="space-y-3">
                    {stats.favorite_categories.slice(0, 4).map((category) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{category.category}</span>
                        <Badge variant="secondary">{category.course_count} courses</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/courses">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Courses
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/student/certificates">
                    <Award className="h-4 w-4 mr-2" />
                    View Certificates
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/student/progress">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Learning Analytics
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
