"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  DollarSign,
  BookOpen,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Copy,
  Globe,
  ArrowLeft,
} from "lucide-react"
import { CourseCreationForm } from "@/components/instructor/course-creation-form"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  updated_at: string
}

export default function InstructorCoursesPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

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
        setFilteredCourses(coursesList)
      } else {
        setCourses([])
        setFilteredCourses([])
      }
    } catch (error) {
      console.log("Courses API error:", error)
      setCourses([])
      setFilteredCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [user])

  // Filter courses based on search and filters
  useEffect(() => {
    let filtered = courses

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((course) => course.status === statusFilter)
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((course) => course.category === categoryFilter)
    }

    setFilteredCourses(filtered)
  }, [courses, searchTerm, statusFilter, categoryFilter])

  const handleCourseCreated = () => {
    setShowCreateForm(false)
    fetchCourses()
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchCourses()
      } else {
        alert("Failed to delete course")
      }
    } catch (error) {
      alert("Error deleting course")
    }
  }

  const handleDuplicateCourse = async (courseId: string) => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/courses/${courseId}/duplicate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchCourses()
      } else {
        alert("Failed to duplicate course")
      }
    } catch (error) {
      alert("Error duplicating course")
    }
  }

  const handleToggleStatus = async (courseId: string) => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/courses/${courseId}/publish`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchCourses()
      } else {
        alert("Failed to update course status")
      }
    } catch (error) {
      alert("Error updating course status")
    }
  }

  const categories = [...new Set(courses.map((course) => course.category))].filter(Boolean)

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
              <div className="flex items-center gap-3 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer">
                <TrendingUp className="h-5 w-5" />
                <span>Dashboard</span>
              </div>
            </Link>
            <Link href="/instructor/courses" passHref>
              <div className="flex items-center gap-3 p-3 bg-blue-600 rounded-lg cursor-pointer">
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
                <TrendingUp className="h-5 w-5" />
                <span>Analytics</span>
              </div>
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/instructor/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
                <p className="text-slate-600">Manage and track all your courses</p>
              </div>
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

          {/* Filters and Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Courses</p>
                    <p className="text-2xl font-bold">{courses.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Published</p>
                    <p className="text-2xl font-bold">{courses.filter((c) => c.status === "published").length}</p>
                  </div>
                  <Globe className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Students</p>
                    <p className="text-2xl font-bold">
                      {courses.reduce((sum, course) => sum + (course.enrollment_count || 0), 0)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                    <p className="text-2xl font-bold">
                      $
                      {courses
                        .reduce((sum, course) => sum + (course.price || 0) * (course.enrollment_count || 0), 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {courses.length === 0 ? "No courses yet" : "No courses match your filters"}
                </h3>
                <p className="text-slate-600 mb-6">
                  {courses.length === 0
                    ? "Create your first course to start teaching and sharing your knowledge."
                    : "Try adjusting your search or filter criteria."}
                </p>
                {courses.length === 0 && (
                  <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Course
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-slate-200 relative">
                    <img
                      src={course.thumbnail_url || "/placeholder.svg?height=200&width=300"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/instructor/courses/${course.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Course
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/courses/${course.id}`} target="_blank">
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(course.id)}>
                            <Globe className="h-4 w-4 mr-2" />
                            {course.status === "published" ? "Unpublish" : "Publish"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateCourse(course.id)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteCourse(course.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={course.status === "published" ? "default" : "secondary"}>{course.status}</Badge>
                      <span className="text-lg font-bold text-slate-900">
                        {course.price > 0 ? `$${course.price}` : "Free"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.enrollment_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {(course.average_rating || 0).toFixed(1)}
                        </span>
                      </div>
                      <span className="capitalize">{course.difficulty}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button asChild size="sm" className="flex-1">
                        <Link href={`/instructor/courses/${course.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Link href={`/courses/${course.id}`} target="_blank">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
