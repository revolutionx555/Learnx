"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Users, DollarSign, BookOpen, TrendingUp, Plus, Edit, Eye, BarChart3, PieChart, Activity } from "lucide-react"
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

interface DashboardData {
  overview: {
    totalStudents: number
    totalRevenue: number
    activeCourses: number
    totalCourses: number
    averageRating: number
    totalReviews: number
  }
  monthlyRevenue: Array<{
    _id: { year: number; month: number }
    revenue: number
    count: number
  }>
  coursePerformance: Array<{
    id: string
    title: string
    enrollments: number
    revenue: number
    rating: number
    reviews: number
    status: string
  }>
  recentActivity: {
    newEnrollments: number
    newReviews: number
  }
  growth: {
    studentsGrowth: string
    revenueGrowth: string
    coursesGrowth: string
  }
}

export default function InstructorDashboard() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      const token = localStorage.getItem("auth_token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const [coursesResponse, dashboardResponse] = await Promise.all([
        fetch(`/api/courses?instructor_id=${user.id}`, { headers }),
        fetch(`/api/instructor/dashboard?instructor_id=${user.id}`, { headers }),
      ])

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json()
        const coursesList = coursesData.courses || coursesData.data || []
        setCourses(coursesList)
      }

      if (dashboardResponse.ok) {
        const dashboardResult = await dashboardResponse.json()
        setDashboardData(dashboardResult.data)
      }
    } catch (error) {
      console.log("Dashboard API error:", error)
      const totalStudents = courses.reduce((sum, course) => sum + (course.enrollment_count || 0), 0)
      const totalRevenue = courses.reduce(
        (sum, course) => sum + (course.price || 0) * (course.enrollment_count || 0),
        0,
      )
      const activeCourses = courses.filter((course) => course.status === "published").length
      const averageRating =
        courses.length > 0 ? courses.reduce((sum, course) => sum + (course.average_rating || 0), 0) / courses.length : 0

      setDashboardData({
        overview: {
          totalStudents,
          totalRevenue,
          activeCourses,
          totalCourses: courses.length,
          averageRating,
          totalReviews: courses.reduce((sum, course) => sum + (course.review_count || 0), 0),
        },
        monthlyRevenue: [],
        coursePerformance: [],
        recentActivity: { newEnrollments: 0, newReviews: 0 },
        growth: { studentsGrowth: "0%", revenueGrowth: "0%", coursesGrowth: "0%" },
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const handleCourseCreated = () => {
    setShowCreateForm(false)
    fetchDashboardData()
  }

  const overview = dashboardData?.overview || {
    totalStudents: 0,
    totalRevenue: 0,
    activeCourses: 0,
    totalCourses: 0,
    averageRating: 0,
    totalReviews: 0,
  }

  const revenueChartData =
    dashboardData?.monthlyRevenue.map((item) => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      revenue: item.revenue,
      enrollments: item.count,
    })) || []

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
                    <div className="text-2xl font-bold text-slate-900">{overview.totalStudents.toLocaleString()}</div>
                    <div className="text-sm text-slate-500">Total Students</div>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: overview.totalStudents > 0 ? "75%" : "0%" }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {overview.totalStudents > 0
                    ? `${dashboardData?.growth.studentsGrowth || "+12%"} from last month`
                    : "Create your first course to get started"}
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
                    <div className="text-2xl font-bold text-slate-900">${overview.totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-slate-500">Total Revenue</div>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: overview.totalRevenue > 0 ? "85%" : "0%" }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {overview.totalRevenue > 0
                    ? `${dashboardData?.growth.revenueGrowth || "+8%"} from last month`
                    : "Revenue will appear after course sales"}
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
                    <div className="text-2xl font-bold text-slate-900">{overview.activeCourses}</div>
                    <div className="text-sm text-slate-500">Active Courses</div>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: overview.activeCourses > 0 ? "60%" : "0%" }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {overview.totalCourses > 0
                    ? `${overview.totalCourses - overview.activeCourses} drafts`
                    : "No courses created yet"}
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
                      {overview.averageRating > 0 ? overview.averageRating.toFixed(1) : "N/A"}
                    </div>
                    <div className="text-sm text-slate-500">Avg. Rating</div>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: overview.averageRating > 0 ? `${(overview.averageRating / 5) * 100}%` : "0%" }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {overview.averageRating > 0
                    ? `${overview.totalReviews} reviews`
                    : "Ratings will appear after course reviews"}
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
                {revenueChartData.length > 0 ? (
                  <div className="space-y-3">
                    {revenueChartData.slice(-6).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">{item.month}</span>
                        <div className="flex items-center gap-2 flex-1 ml-4">
                          <div className="flex-1 bg-slate-100 rounded-full h-3">
                            <div
                              className="bg-blue-500 h-3 rounded-full"
                              style={{
                                width: `${Math.min(
                                  (item.revenue / Math.max(...revenueChartData.map((d) => d.revenue))) * 100,
                                  100,
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-900">${item.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                      <p className="text-slate-500">Revenue analytics will appear after sales</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Performance */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-green-600" />
                  Course Performance
                </CardTitle>
                <CardDescription>Top performing courses by enrollment</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData?.coursePerformance && dashboardData.coursePerformance.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.coursePerformance.slice(0, 5).map((course, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 truncate">{course.title}</span>
                        <div className="flex items-center gap-2 flex-1 ml-4">
                          <div className="flex-1 bg-slate-100 rounded-full h-3">
                            <div
                              className="bg-green-500 h-3 rounded-full"
                              style={{
                                width: `${Math.min(
                                  (course.enrollments /
                                    Math.max(...dashboardData.coursePerformance.map((c) => c.enrollments))) *
                                    100,
                                  100,
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-900">{course.enrollments} students</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-green-400 mx-auto mb-2" />
                      <p className="text-slate-500">Course performance data will appear after enrollments</p>
                    </div>
                  </div>
                )}
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
                        {course.status === "published" && (
                          <Link href={`/courses/${course.id}`} passHref>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
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
