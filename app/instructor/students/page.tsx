"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  BookOpen,
  TrendingUp,
  Search,
  Filter,
  Mail,
  MessageSquare,
  ArrowLeft,
  Calendar,
  Clock,
  Award,
  BarChart3,
  Download,
  Eye,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface Student {
  id: string
  name: string
  email: string
  avatar_url?: string
  enrollment_date: string
  total_courses: number
  completed_courses: number
  progress_percentage: number
  last_activity: string
  status: "active" | "inactive"
  courses: Array<{
    id: string
    title: string
    progress: number
    enrollment_date: string
    completion_date?: string
    status: "in_progress" | "completed" | "not_started"
  }>
}

interface StudentStats {
  total_students: number
  active_students: number
  new_this_month: number
  completion_rate: number
  average_progress: number
}

export default function InstructorStudentsPage() {
  const { user } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [stats, setStats] = useState<StudentStats>({
    total_students: 0,
    active_students: 0,
    new_this_month: 0,
    completion_rate: 0,
    average_progress: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [courseFilter, setCourseFilter] = useState("all")
  const [courses, setCourses] = useState<Array<{ id: string; title: string }>>([])

  const fetchStudentsData = async () => {
    if (!user) return

    try {
      const token = localStorage.getItem("auth_token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      // Fetch instructor's courses first
      const coursesResponse = await fetch(`/api/courses?instructor_id=${user.id}`, { headers })
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json()
        const coursesList = coursesData.courses || coursesData.data || []
        setCourses(coursesList)
      }

      // Fetch students data
      const studentsResponse = await fetch(`/api/instructor/students?instructor_id=${user.id}`, { headers })
      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json()
        const studentsList = studentsData.students || studentsData.data || []
        setStudents(studentsList)
        setFilteredStudents(studentsList)

        // Calculate stats
        const totalStudents = studentsList.length
        const activeStudents = studentsList.filter((s: Student) => s.status === "active").length
        const newThisMonth = studentsList.filter((s: Student) => {
          const enrollmentDate = new Date(s.enrollment_date)
          const now = new Date()
          const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1)
          return enrollmentDate >= monthAgo
        }).length
        const completionRate =
          totalStudents > 0
            ? (studentsList.reduce((sum: number, s: Student) => sum + s.completed_courses, 0) /
                studentsList.reduce((sum: number, s: Student) => sum + s.total_courses, 0)) *
              100
            : 0
        const averageProgress =
          totalStudents > 0
            ? studentsList.reduce((sum: number, s: Student) => sum + s.progress_percentage, 0) / totalStudents
            : 0

        setStats({
          total_students: totalStudents,
          active_students: activeStudents,
          new_this_month: newThisMonth,
          completion_rate: Math.round(completionRate),
          average_progress: Math.round(averageProgress),
        })
      } else {
        // Mock data for demonstration
        const mockStudents: Student[] = [
          {
            id: "1",
            name: "Alice Johnson",
            email: "alice@example.com",
            avatar_url: "/placeholder.svg?height=40&width=40",
            enrollment_date: "2024-01-15",
            total_courses: 3,
            completed_courses: 1,
            progress_percentage: 75,
            last_activity: "2024-01-20",
            status: "active",
            courses: [
              {
                id: "c1",
                title: "React Fundamentals",
                progress: 100,
                enrollment_date: "2024-01-15",
                completion_date: "2024-01-18",
                status: "completed",
              },
              {
                id: "c2",
                title: "Advanced JavaScript",
                progress: 60,
                enrollment_date: "2024-01-16",
                status: "in_progress",
              },
              { id: "c3", title: "Node.js Basics", progress: 0, enrollment_date: "2024-01-20", status: "not_started" },
            ],
          },
          {
            id: "2",
            name: "Bob Smith",
            email: "bob@example.com",
            enrollment_date: "2024-01-10",
            total_courses: 2,
            completed_courses: 0,
            progress_percentage: 45,
            last_activity: "2024-01-19",
            status: "active",
            courses: [
              {
                id: "c1",
                title: "React Fundamentals",
                progress: 45,
                enrollment_date: "2024-01-10",
                status: "in_progress",
              },
              {
                id: "c2",
                title: "Advanced JavaScript",
                progress: 0,
                enrollment_date: "2024-01-15",
                status: "not_started",
              },
            ],
          },
          {
            id: "3",
            name: "Carol Davis",
            email: "carol@example.com",
            enrollment_date: "2023-12-20",
            total_courses: 4,
            completed_courses: 3,
            progress_percentage: 90,
            last_activity: "2024-01-18",
            status: "active",
            courses: [
              {
                id: "c1",
                title: "React Fundamentals",
                progress: 100,
                enrollment_date: "2023-12-20",
                completion_date: "2023-12-25",
                status: "completed",
              },
              {
                id: "c2",
                title: "Advanced JavaScript",
                progress: 100,
                enrollment_date: "2023-12-22",
                completion_date: "2024-01-05",
                status: "completed",
              },
              {
                id: "c3",
                title: "Node.js Basics",
                progress: 100,
                enrollment_date: "2024-01-08",
                completion_date: "2024-01-15",
                status: "completed",
              },
              {
                id: "c4",
                title: "Full Stack Development",
                progress: 25,
                enrollment_date: "2024-01-16",
                status: "in_progress",
              },
            ],
          },
        ]
        setStudents(mockStudents)
        setFilteredStudents(mockStudents)
        setStats({
          total_students: 3,
          active_students: 3,
          new_this_month: 1,
          completion_rate: 67,
          average_progress: 70,
        })
      }
    } catch (error) {
      console.log("Students API error:", error)
      // Use mock data on error
      const mockStudents: Student[] = [
        {
          id: "1",
          name: "Alice Johnson",
          email: "alice@example.com",
          avatar_url: "/placeholder.svg?height=40&width=40",
          enrollment_date: "2024-01-15",
          total_courses: 3,
          completed_courses: 1,
          progress_percentage: 75,
          last_activity: "2024-01-20",
          status: "active",
          courses: [
            {
              id: "c1",
              title: "React Fundamentals",
              progress: 100,
              enrollment_date: "2024-01-15",
              completion_date: "2024-01-18",
              status: "completed",
            },
            {
              id: "c2",
              title: "Advanced JavaScript",
              progress: 60,
              enrollment_date: "2024-01-16",
              status: "in_progress",
            },
            { id: "c3", title: "Node.js Basics", progress: 0, enrollment_date: "2024-01-20", status: "not_started" },
          ],
        },
      ]
      setStudents(mockStudents)
      setFilteredStudents(mockStudents)
      setStats({
        total_students: 1,
        active_students: 1,
        new_this_month: 1,
        completion_rate: 33,
        average_progress: 75,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudentsData()
  }, [user])

  // Filter students based on search and filters
  useEffect(() => {
    let filtered = students

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((student) => student.status === statusFilter)
    }

    // Course filter
    if (courseFilter !== "all") {
      filtered = filtered.filter((student) => student.courses.some((course) => course.id === courseFilter))
    }

    setFilteredStudents(filtered)
  }, [students, searchTerm, statusFilter, courseFilter])

  const handleExportData = () => {
    const csvContent = [
      ["Name", "Email", "Enrollment Date", "Total Courses", "Completed Courses", "Progress %", "Status"],
      ...filteredStudents.map((student) => [
        student.name,
        student.email,
        student.enrollment_date,
        student.total_courses.toString(),
        student.completed_courses.toString(),
        student.progress_percentage.toString(),
        student.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "students-data.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

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
              <div className="flex items-center gap-3 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer">
                <BookOpen className="h-5 w-5" />
                <span>Courses</span>
              </div>
            </Link>
            <Link href="/instructor/students" passHref>
              <div className="flex items-center gap-3 p-3 bg-blue-600 rounded-lg cursor-pointer">
                <Users className="h-5 w-5" />
                <span>Students</span>
              </div>
            </Link>
            <Link href="/instructor/revenue" passHref>
              <div className="flex items-center gap-3 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer">
                <BarChart3 className="h-5 w-5" />
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
                <h1 className="text-3xl font-bold text-slate-900">Students</h1>
                <p className="text-slate-600">Manage and track your student community</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Students</p>
                    <p className="text-2xl font-bold">{stats.total_students}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Students</p>
                    <p className="text-2xl font-bold">{stats.active_students}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">New This Month</p>
                    <p className="text-2xl font-bold">{stats.new_this_month}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Completion Rate</p>
                    <p className="text-2xl font-bold">{stats.completion_rate}%</p>
                  </div>
                  <Award className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg Progress</p>
                    <p className="text-2xl font-bold">{stats.average_progress}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-teal-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search students by name or email..."
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={courseFilter} onValueChange={setCourseFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {students.length === 0 ? "No students yet" : "No students match your filters"}
                </h3>
                <p className="text-slate-600">
                  {students.length === 0
                    ? "Students will appear here once they enroll in your courses."
                    : "Try adjusting your search or filter criteria."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={student.avatar_url || "/placeholder.svg"} alt={student.name} />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-slate-900">{student.name}</h3>
                          <p className="text-sm text-slate-600">{student.email}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge variant={student.status === "active" ? "default" : "secondary"}>
                              {student.status}
                            </Badge>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Enrolled {new Date(student.enrollment_date).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last active {new Date(student.last_activity).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm font-medium text-slate-900">{student.total_courses}</p>
                          <p className="text-xs text-slate-600">Courses</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-slate-900">{student.completed_courses}</p>
                          <p className="text-xs text-slate-600">Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-slate-900">{student.progress_percentage}%</p>
                          <p className="text-xs text-slate-600">Progress</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-slate-600 mb-1">
                        <span>Overall Progress</span>
                        <span>{student.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${student.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Course Enrollments */}
                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-700 mb-2">Enrolled Courses:</p>
                      <div className="flex flex-wrap gap-2">
                        {student.courses.map((course) => (
                          <Badge
                            key={course.id}
                            variant={course.status === "completed" ? "default" : "outline"}
                            className="text-xs"
                          >
                            {course.title} ({course.progress}%)
                          </Badge>
                        ))}
                      </div>
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
