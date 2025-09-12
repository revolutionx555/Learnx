"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, GripVertical } from "lucide-react"

interface Section {
  id: string
  title: string
  description: string
  order_index: number
  lessons?: any[]
}

interface SectionManagementProps {
  courseId: string
  sections: Section[]
  onUpdate: () => void
}

export function SectionManagement({ courseId, sections, onUpdate }: SectionManagementProps) {
  const [showSectionForm, setShowSectionForm] = useState(false)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [sectionForm, setSectionForm] = useState({
    title: "",
    description: "",
  })

  const resetForm = () => {
    setSectionForm({ title: "", description: "" })
    setEditingSection(null)
    setError("")
    setSuccess("")
  }

  const handleCreateSection = async () => {
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const response = await fetch(`/api/courses/${courseId}/sections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(sectionForm),
      })

      if (response.ok) {
        resetForm()
        setShowSectionForm(false)
        setSuccess("Section created successfully.")
        onUpdate()
      } else {
        setError("Failed to create section.")
      }
    } catch (error) {
      setError("Error creating section.")
    } finally {
      setLoading(false)
    }
  }

  const handleEditSection = (section: Section) => {
    setEditingSection(section)
    setSectionForm({ title: section.title, description: section.description || "" })
    setShowSectionForm(true)
  }

  const handleUpdateSection = async () => {
    if (!editingSection) return
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const response = await fetch(`/api/sections/${editingSection.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(sectionForm),
      })

      if (response.ok) {
        resetForm()
        setShowSectionForm(false)
        setSuccess("Section updated successfully.")
        onUpdate()
      } else {
        setError("Failed to update section.")
      }
    } catch (error) {
      setError("Error updating section.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Are you sure? This will delete all lessons in this section.")) return
    setError("")
    setSuccess("")
    try {
      const response = await fetch(`/api/sections/${sectionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })

      if (response.ok) {
        setSuccess("Section deleted.")
        onUpdate()
      } else {
        setError("Failed to delete section.")
      }
    } catch (error) {
      setError("Error deleting section.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Course Sections</h3>
        <Dialog open={showSectionForm} onOpenChange={setShowSectionForm}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSection ? "Edit Section" : "Create New Section"}</DialogTitle>
            </DialogHeader>

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

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="section-title">Section Title</Label>
                <Input
                  id="section-title"
                  value={sectionForm.title}
                  onChange={(e) => setSectionForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Getting Started, Advanced Concepts"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="section-description">Description (Optional)</Label>
                <Textarea
                  id="section-description"
                  value={sectionForm.description}
                  onChange={(e) => setSectionForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this section"
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowSectionForm(false)} disabled={loading}>
                Cancel
              </Button>
              <Button
                onClick={editingSection ? handleUpdateSection : handleCreateSection}
                disabled={loading || !sectionForm.title}
              >
                {loading
                  ? editingSection
                    ? "Updating..."
                    : "Creating..."
                  : editingSection
                  ? "Update Section"
                  : "Create Section"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    {section.title}
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{section.lessons?.length || 0} lessons</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSection(section)}
                    aria-label="Edit Section"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSection(section.id)}
                    aria-label="Delete Section"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {sections.length === 0 && (
          <Alert>
            <AlertDescription>
              No sections created yet. Add your first section to start organizing your course content.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
