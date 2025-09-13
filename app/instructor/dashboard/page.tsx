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

export default function InstructorDashboard() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return
      setLoading(true)
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
        setCourses([])
        setDashboardData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [user])

  const handleCourseCreated = () => {
    setShowCreateForm(false)
    // Reload dashboard after course creation
    if (user) {
      setLoading(true)
      fetch(`/api/courses?instructor_id=${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setCourses(data.courses || data.data || []))
        .finally(() => setLoading(false))
    }
  }

  // ... rest of your dashboard UI unchanged, loading/error states as needed ...

  return (
    <ProtectedRoute allowedRoles={["instructor"]}>
      <div className="min-h-screen bg-slate-50">
        {/* Sidebar ... unchanged ... */}

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
          {/* ...rest of analytics and overview cards... */}
          {/* Course Management ... unchanged ... */}
        </div>
      </div>
    </ProtectedRoute>
  )
}
