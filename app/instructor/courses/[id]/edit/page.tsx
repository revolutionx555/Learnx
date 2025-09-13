"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, Globe } from "lucide-react"
import Link from "next/link"
import { SectionManagement } from "@/components/instructor/section-management"
import { LessonManagement } from "@/components/instructor/lesson-management"
import { useAuth } from "@/hooks/use-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CourseEditPage() {
  const params = useParams()
  const courseId = params.id as string
  const { user } = useAuth()
  const [course, setCourse] = useState<any>(null)
  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchCourseData = async () => {
    setLoading(true)
    setError("")
    try {
      const [courseResponse, sectionsResponse] = await Promise.all([
        fetch(`/api/instructor/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
        }),
        fetch(`/api/instructor/courses/${courseId}/sections`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
        }),
      ])

      if (courseResponse.ok) {
        const courseData = await courseResponse.json()
        setCourse(courseData.data)
      } else {
        setError("Failed to fetch course details.")
      }

      if (sectionsResponse.ok) {
        const sectionsData = await sectionsResponse.json()
        setSections(sectionsData.data || [])
      } else {
        setError("Failed to fetch course sections.")
      }
    } catch (err: any) {
      setError("Error fetching course data: " + (err?.message || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  const handlePublishCourse = async () => {
    setPublishing(true)
    setError("")
    setSuccess("")
    try {
      const response = await fetch(`/api/courses/${courseId}/publish`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })

      if (response.ok) {
        setSuccess("Course published successfully!")
        await fetchCourseData()
      } else {
        setError("Error publishing course.")
      }
    } catch (err: any) {
      setError("Error publishing course: " + (err?.message || "Unknown error"))
    } finally {
      setPublishing(false)
    }
  }

  useEffect(() => {
    if (courseId) {
      fetchCourseData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  const totalLessons = sections.reduce(
    (total, section) => total + (Array.isArray(section.lessons) ? section.lessons.length : 0),
    0,
  )

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertDescription>Course not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {(error || success) && (
        <div className="mb-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/instructor/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={course.status === "published" ? "default" : "secondary"}>{course.status}</Badge>
              <span className="text-sm text-muted-foreground">
                {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={course.status === "published" ? `/courses/${courseId}` : "#"}
            target="_blank"
            rel="noopener"
            aria-disabled={course.status !== "published"}
            tabIndex={course.status === "published" ? 0 : -1}
          >
            <Button variant="outline" size="sm" disabled={course.status !== "published"}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </Link>
          {course.status === "draft" && (
            <Button
              onClick={handlePublishCourse}
              disabled={publishing}
              aria-disabled={publishing}
              aria-busy={publishing}
            >
              <Globe className="h-4 w-4 mr-2" />
              {publishing ? "Publishing..." : "Publish Course"}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <SectionManagement courseId={courseId} sections={sections} onUpdate={fetchCourseData} />
          <LessonManagement courseId={courseId} sections={sections} onUpdate={fetchCourseData} />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Course Settings</CardTitle>
              <CardDescription>Manage course details and configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Course settings panel coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
              <CardDescription>View and manage student enrollments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Student management panel coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Course Analytics</CardTitle>
              <CardDescription>Track course performance and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
