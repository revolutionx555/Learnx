"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Play, Clock } from "lucide-react"

interface Lesson {
  id: string
  title: string
  description: string
  content_type: string
  content_url: string
  duration_minutes: number
  order_index: number
  is_preview: boolean
  section_id: string
}

interface Section {
  id: string
  title: string
  lessons?: Lesson[]
}

interface LessonManagementProps {
  courseId: string
  sections: Section[]
  onUpdate: () => void
}

export function LessonManagement({ courseId, sections, onUpdate }: LessonManagementProps) {
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [selectedSection, setSelectedSection] = useState("")
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")

  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    content_type: "video",
    content_url: "",
    duration_minutes: 0,
    is_preview: false,
  })

  const resetForm = () => {
    setLessonForm({
      title: "",
      description: "",
      content_type: "video",
      content_url: "",
      duration_minutes: 0,
      is_preview: false,
    })
    setEditingLesson(null)
    setSelectedSection("")
    setFormError("")
    setFormSuccess("")
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""

  const handleCreateLesson = async () => {
    setLoading(true)
    setFormError("")
    setFormSuccess("")

    if (!selectedSection || !lessonForm.title) {
      setFormError("Section and lesson title are required.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/lessons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...lessonForm,
          section_id: selectedSection,
        }),
      })

      if (response.ok) {
        resetForm()
        setShowLessonForm(false)
        setFormSuccess("Lesson created successfully")
        onUpdate()
      } else {
        const errorData = await response.json()
        setFormError(errorData.error || "Failed to create lesson.")
      }
    } catch (error) {
      setFormError("Error creating lesson: " + error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateLesson = async () => {
    setLoading(true)
    setFormError("")
    setFormSuccess("")

    if (!editingLesson || !lessonForm.title) {
      setFormError("Lesson title is required.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/lessons/${editingLesson.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(lessonForm),
      })

      if (response.ok) {
        resetForm()
        setShowLessonForm(false)
        setFormSuccess("Lesson updated successfully")
        onUpdate()
      } else {
        const errorData = await response.json()
        setFormError(errorData.error || "Failed to update lesson.")
      }
    } catch (error) {
      setFormError("Error updating lesson: " + error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return

    setFormError("")
    setFormSuccess("")

    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setFormSuccess("Lesson deleted.")
        onUpdate()
      } else {
        const errorData = await response.json()
        setFormError(errorData.error || "Failed to delete lesson.")
      }
    } catch (error) {
      setFormError("Error deleting lesson: " + error)
    }
  }

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setLessonForm({
      title: lesson.title,
      description: lesson.description || "",
      content_type: lesson.content_type,
      content_url: lesson.content_url || "",
      duration_minutes: lesson.duration_minutes || 0,
      is_preview: lesson.is_preview || false,
    })
    setSelectedSection(lesson.section_id)
    setShowLessonForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Course Lessons</h3>
        <Dialog open={showLessonForm} onOpenChange={setShowLessonForm}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} disabled={sections.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingLesson ? "Edit Lesson" : "Create New Lesson"}</DialogTitle>
            </DialogHeader>

            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            {formSuccess && (
              <Alert>
                <AlertDescription>{formSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 pt-2">
              {!editingLesson && (
                <div className="space-y-2">
                  <Label htmlFor="section-select">Section *</Label>
                  <Select value={selectedSection} onValueChange={setSelectedSection} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="lesson-title">Lesson Title *</Label>
                <Input
                  id="lesson-title"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Introduction to React Hooks"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lesson-description">Description</Label>
                <Textarea
                  id="lesson-description"
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this lesson"
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="content-type">Content Type</Label>
                  <Select
                    value={lessonForm.content_type}
                    onValueChange={(value) => setLessonForm((prev) => ({ ...prev, content_type: value }))}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="text">Text/Article</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    value={lessonForm.duration_minutes}
                    onChange={(e) =>
                      setLessonForm((prev) => ({ ...prev, duration_minutes: Number.parseInt(e.target.value) || 0 }))
                    }
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-url">Content URL</Label>
                <Input
                  id="content-url"
                  value={lessonForm.content_url}
                  onChange={(e) => setLessonForm((prev) => ({ ...prev, content_url: e.target.value }))}
                  placeholder="https://example.com/video.mp4 or YouTube URL"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is-preview"
                  checked={lessonForm.is_preview}
                  onChange={(e) => setLessonForm((prev) => ({ ...prev, is_preview: e.target.checked }))}
                  disabled={loading}
                />
                <Label htmlFor="is-preview">Allow preview (free access)</Label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowLessonForm(false)} disabled={loading}>
                Cancel
              </Button>
              <Button
                onClick={editingLesson ? handleUpdateLesson : handleCreateLesson}
                disabled={loading || !lessonForm.title || (!editingLesson && !selectedSection)}
              >
                {loading
                  ? editingLesson
                    ? "Updating..."
                    : "Creating..."
                  : editingLesson
                    ? "Update Lesson"
                    : "Create Lesson"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {sections.length === 0 ? (
        <Alert>
          <AlertDescription>Create sections first before adding lessons.</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="text-base">{section.title}</CardTitle>
                <CardDescription>
                  {section.lessons?.length || 0} lesson{(section.lessons?.length || 0) !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {section.lessons && section.lessons.length > 0 ? (
                  <div className="space-y-2">
                    {section.lessons.map((lesson, index) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{lesson.title}</h4>
                              {lesson.is_preview && <Badge variant="secondary">Preview</Badge>}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <Play className="h-3 w-3" />
                                {lesson.content_type}
                              </span>
                              {lesson.duration_minutes > 0 && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {lesson.duration_minutes}m
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditLesson(lesson)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteLesson(lesson.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No lessons in this section yet.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
