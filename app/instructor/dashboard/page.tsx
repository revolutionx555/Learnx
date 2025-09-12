"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
  Users,
  DollarSign,
  BookOpen,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import { CourseCreationForm } from "@/components/instructor/course-creation-form"
import { useAuth } from "@/hooks/use-auth"

interface Course {
  id: string
  title: string
  description: string
  thumbnail_url: string
  price: number
  difficulty: string
  category: string
  enrollment_count: number
  average_rating: number
  review_count: number
  status: string
  created_at: string
}

export default function InstructorDashboard() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const fetchCourses = async () => {
    if (!user) return

    try {
      const token = localStorage.getItem("auth_token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const response = await fetch(`/api/courses?instructor_id=${user.id}`, { headers })
      if (response.ok) {
        const coursesData = await response.json()
        const coursesList = coursesData.courses || coursesData.data || []
        setCourses(coursesList)
      } else {
        setCourses([])
      }
    } catch (error) {
      console.log("Courses API error, using fallback:", error)
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [user])

  const handleCourseCreated = () => {
    setShowCreateForm(false)
    fetchCourses()
  }

  const totalStudents = courses.reduce((sum, course) => sum + (course.enrollment_count || 0), 0)
  const totalRevenue = courses.reduce((sum, course) => sum + (course.price || 0) * (course.enrollment_count || 0), 0)
  const activeCourses = courses.filter((course) => course.status === "published").length
  const averageRating =
    courses.length > 0 ? courses.reduce((sum, course) => sum + (course.average_rating || 0), 0) / courses.length : 0

  return (
    <ProtectedRoute allowedRoles={["instructor"]}>
      <div className="min-h-screen bg-slate-50">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold">Learn X</h2>
            <p className="text-slate-400 text-sm">Instructor Portal</p>
          </div>
          <nav className="space-y-2">
            <Link href="/instructor/dashboard" passHref>
              <div className="flex items-center gap-3 p-3 bg-blue-600 rounded-lg cursor-pointer">
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </div>
            </Link>
            <Link href="/instructor/courses" passHref>
              <div className="flex items-center gap-3 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer">
                <BookOpen className="h-5 w-5" />
                <span>Courses</span>
              </div>
            </Link>
            <Link href="/instructor/students" passHref>
              <div className="flex items-center gap-3 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer">
                <Users className="h-5 w-5" />
                <span>Students</span>
              </div>
            </Link>
            <Link href="/instructor/revenue" passHref>
              <div className="flex items-center gap-3 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer">
                <DollarSign className="h-5 w-5" />
                <span>Revenue</span>
              </div>
            </Link>
            <Link href="/instructor/analytics" passHref>
              <div className="flex items-center gap-3 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer">
                <Activity className="h-5 w-5" />
                <span>Analytics</span>
              </div>
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
              <p className="text-slate-600">Welcome back, {user?.name}! Here's your teaching performance.</p>
            </div>
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <CourseCreationForm onClose={() => setShowCreateForm(false)} onSuccess={handleCourseCreated} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Students Card */}
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{totalStudents.toLocaleString()}</div>
                    <div className="text-sm text-slate-500">Total Students</div>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: totalStudents > 0 ? "75%" : "0%" }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {totalStudents > 0 ? "+12% from last month" : "Create your first course to get started"}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Card */}
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-slate-500">Total Revenue</div>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: totalRevenue > 0 ? "85%" : "0%" }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {totalRevenue > 0 ? "+8% from last month" : "Revenue will appear after course sales"}
                </div>
              </CardContent>
            </Card>

            {/* Active Courses Card */}
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{activeCourses}</div>
                    <div className="text-sm text-slate-500">Active Courses</div>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: activeCourses > 0 ? "60%" : "0%" }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {courses.length > 0 ? `${courses.length - activeCourses} drafts` : "No courses created yet"}
                </div>
              </CardContent>
            </Card>

            {/* Average Rating Card */}
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">
                      {averageRating > 0 ? averageRating.toFixed(1) : "N/A"}
                    </div>
                    <div className="text-sm text-slate-500">Avg. Rating</div>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: averageRating > 0 ? `${(averageRating / 5) * 100}%` : "0%" }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {averageRating > 0 ? "Excellent performance" : "Ratings will appear after course reviews"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Revenue Analytics
                </CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                    <p className="text-slate-500">
                      {totalRevenue > 0 ? "Revenue chart visualization" : "Revenue analytics will appear after sales"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Engagement */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-green-600" />
                  Student Engagement
                </CardTitle>
                <CardDescription>Course completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-green-400 mx-auto mb-2" />
                    <p className="text-slate-500">
                      {totalStudents > 0
                        ? "Engagement metrics"
                        : "Student engagement data will appear after enrollments"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Management */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Your Courses</CardTitle>
              <CardDescription>Manage and track your course performance</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading courses...</div>
              ) : courses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 mb-4">No courses yet. Create your first course to get started!</p>
                  <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Course
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.slice(0, 5).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{course.title}</h4>
                          <p className="text-sm text-slate-500">
                            {course.enrollment_count || 0} students • {(course.average_rating || 0).toFixed(1)} ★ •
                            {course.status === "published" ? " Published" : " Draft"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/instructor/courses/${course.id}/edit`} passHref>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/courses/${course.id}`} passHref>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {courses.length > 5 && (
                    <div className="text-center pt-4">
                      <Link href="/instructor/courses" passHref>
                        <Button variant="outline">View All Courses ({courses.length})</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
