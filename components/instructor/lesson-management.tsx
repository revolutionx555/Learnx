"use client"

import { useState } from "react"
// ...other imports remain unchanged...

export function LessonManagement({ courseId, sections, onUpdate }: LessonManagementProps) {
  // ...state declarations unchanged...

  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")

  // Use consistent token
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""

  const handleCreateLesson = async () => {
    setFormError("")
    setFormSuccess("")
    if (!selectedSection || !lessonForm.title) {
      setFormError("Section and lesson title are required.")
      return
    }
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons`, {
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
        setFormError("Failed to create lesson.")
      }
    } catch (error) {
      setFormError("Error creating lesson: " + error)
    }
  }

  const handleUpdateLesson = async () => {
    setFormError("")
    setFormSuccess("")
    if (!editingLesson || !lessonForm.title) {
      setFormError("Lesson title is required.")
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
        setFormError("Failed to update lesson.")
      }
    } catch (error) {
      setFormError("Error updating lesson: " + error)
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
        setFormError("Failed to delete lesson.")
      }
    } catch (error) {
      setFormError("Error deleting lesson: " + error)
    }
  }

  // ...other functions unchanged, be sure to use token in fetch headers...

  // In your DialogContent, add error/success alerts:
  /*
    {formError && (
      <Alert variant="destructive">
        <AlertDescription>{formError}</AlertDescription>
      </Alert>
    )}
    {formSuccess && (
      <Alert variant="success">
        <AlertDescription>{formSuccess}</AlertDescription>
      </Alert>
    )}
  */

  // The rest of your code is good!

  // ...rest unchanged...
}
