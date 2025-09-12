"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { VideoPlayer } from "@/components/player/video-player"
import { LessonSidebar } from "@/components/player/lesson-sidebar"
import { NotesPanel } from "@/components/player/notes-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, ArrowLeft } from "lucide-react"

interface Lesson {
  id: string
  title: string
  description: string
  duration: number
  video_url: string
  is_free: boolean
}

interface Course {
  id: string
  title: string
  lessons: Lesson[]
}

export default function LessonPlayerPage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [progress, setProgress] = useState<Record<string, { completed: boolean; watch_time: number }>>({})
  const [currentTime, setCurrentTime] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourse()
    fetchProgress()
  }, [params.courseId])

  useEffect(() => {
    if (course && params.lessonId) {
      const lesson = course.lessons.find((l) => l.id === params.lessonId)
      setCurrentLesson(lesson || null)
    }
  }, [course, params.lessonId])

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${params.courseId}`)
      if (response.ok) {
        const data = await response.json()
        setCourse(data)
      }
    } catch (error) {
      console.error("Error fetching course:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/progress?courseId=${params.courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const progressMap = data.reduce((acc: any, item: any) => {
          acc[item.lesson_id] = {
            completed: item.completed,
            watch_time: item.watch_time,
          }
          return acc
        }, {})
        setProgress(progressMap)
      }
    } catch (error) {
      console.error("Error fetching progress:", error)
    }
  }

  const updateProgress = async (lessonId: string, completed: boolean, watchTime: number) => {
    try {
      const token = localStorage.getItem("token")
      await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lessonId,
          completed,
          watchTime,
        }),
      })

      setProgress((prev) => ({
        ...prev,
        [lessonId]: { completed, watch_time: watchTime },
      }))
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time)
    if (currentLesson) {
      updateProgress(currentLesson.id, false, Math.floor(time))
    }
  }

  const handleVideoEnded = () => {
    if (currentLesson) {
      updateProgress(currentLesson.id, true, currentLesson.duration * 60)
    }
  }

  const handleLessonSelect = (lesson: Lesson) => {
    router.push(`/learn/${params.courseId}/${lesson.id}`)
  }

  const markAsComplete = () => {
    if (currentLesson) {
      updateProgress(currentLesson.id, true, currentLesson.duration * 60)
    }
  }

  const seekToTime = (time: number) => {
    setCurrentTime(time)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600"></div>
      </div>
    )
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Lesson Not Found</h1>
          <p className="text-muted-foreground">The lesson you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push(`/courses/${course.id}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{course.title}</h1>
              <p className="text-muted-foreground">{currentLesson.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3 space-y-6">
            <VideoPlayer
              src={currentLesson.video_url || `/placeholder.mp4`}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              initialTime={progress[currentLesson.id]?.watch_time || 0}
            />

            {/* Lesson Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{currentLesson.title}</CardTitle>
                  {!progress[currentLesson.id]?.completed && (
                    <Button onClick={markAsComplete} className="gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Mark as Complete
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{currentLesson.description}</p>
              </CardContent>
            </Card>

            {/* Notes Tab */}
            <Tabs defaultValue="notes" className="w-full">
              <TabsList>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              <TabsContent value="notes">
                <NotesPanel lessonId={currentLesson.id} currentTime={currentTime} onSeekTo={seekToTime} />
              </TabsContent>
              <TabsContent value="resources">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">No additional resources for this lesson.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <LessonSidebar
              lessons={course.lessons}
              currentLessonId={currentLesson.id}
              onLessonSelect={handleLessonSelect}
              progress={progress}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
