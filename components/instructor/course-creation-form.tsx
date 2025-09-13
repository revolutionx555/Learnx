"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, X, Upload, ImageIcon, VideoIcon } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface CourseCreationFormProps {
  onClose: () => void
  onSuccess: () => void
}

const categories = [
  "Programming",
  "Design",
  "Business",
  "Marketing",
  "Data Science",
  "Photography",
  "Music",
  "Language",
  "Health & Fitness",
  "Personal Development",
]

export function CourseCreationForm({ onClose, onSuccess }: CourseCreationFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageUploading, setImageUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [videoUploading, setVideoUploading] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string>("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    short_description: "",
    category: "",
    price: "",
    difficulty_level: "",
    thumbnail_url: "",
    promo_video_url: "",
  })

  // Upload thumbnail image logic
  const handleImageUpload = async (file: File) => {
    setImageUploading(true)
    try {
      const tempCourseId = `temp-${Date.now()}`
      const formData = new FormData()
      formData.append("file", file)
      formData.append("courseId", tempCourseId)

      const response = await fetch("/api/upload/course-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload image")
      }

      const result = await response.json()
      setFormData((prev) => ({ ...prev, thumbnail_url: result.url }))
      setImagePreview(result.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setImageUploading(false)
    }
  }

  // Upload promo video logic (stub for Mux; replace with real upload logic)
  const handleVideoUpload = async (file: File) => {
    setVideoUploading(true)
    try {
      const tempCourseId = `temp-${Date.now()}`
      const formData = new FormData()
      formData.append("file", file)
      formData.append("courseId", tempCourseId)

      const response = await fetch("/api/upload/course-promo-video", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload promo video")
      }

      const result = await response.json()
      setFormData((prev) => ({ ...prev, promo_video_url: result.url }))
      setVideoPreview(result.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload promo video")
    } finally {
      setVideoUploading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      handleImageUpload(file)
    }
  }

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedVideo(file)
      setVideoPreview("")
      handleVideoUpload(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number.parseFloat(formData.price) || 0,
          instructor_id: user.id,
          status: "draft",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create course")
      }

      const course = await response.json()
      onSuccess()
      router.push(`/instructor/courses/${course.id}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create course")
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Create New Course</CardTitle>
            <CardDescription>Start building your course and share your knowledge</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Complete React Development Course"
              value={formData.title}
              onChange={(e) => updateFormData("title", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_description">Short Description *</Label>
            <Input
              id="short_description"
              placeholder="Brief description for course cards (max 100 characters)"
              value={formData.short_description}
              onChange={(e) => updateFormData("short_description", e.target.value)}
              maxLength={100}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed course description, what students will learn, prerequisites..."
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => updateFormData("category", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty_level">Difficulty Level *</Label>
              <Select
                value={formData.difficulty_level}
                onValueChange={(value) => updateFormData("difficulty_level", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00 (Free course)"
              value={formData.price}
              onChange={(e) => updateFormData("price", e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Thumbnail Upload UI */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Course Thumbnail</Label>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Course thumbnail preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-transparent"
                    onClick={() => {
                      setImagePreview("")
                      setSelectedImage(null)
                      setFormData((prev) => ({ ...prev, thumbnail_url: "" }))
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">Upload course thumbnail</p>
                  <p className="text-xs text-gray-500 mb-4">Recommended: 1280x720px, JPG or PNG</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="thumbnail-upload"
                    disabled={imageUploading || loading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("thumbnail-upload")?.click()}
                    disabled={imageUploading || loading}
                  >
                    {imageUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Image
                      </>
                    )}
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">Or enter image URL</Label>
                <Input
                  id="thumbnail_url"
                  type="url"
                  placeholder="https://example.com/thumbnail.jpg"
                  value={formData.thumbnail_url}
                  onChange={(e) => {
                    updateFormData("thumbnail_url", e.target.value)
                    if (e.target.value) {
                      setImagePreview(e.target.value)
                    }
                  }}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Promo Video Upload UI */}
          <div className="space-y-2">
            <Label htmlFor="promo_video">Promo Video (optional)</Label>
            <div className="space-y-4">
              {videoPreview ? (
                <div className="relative">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-transparent"
                    onClick={() => {
                      setVideoPreview("")
                      setSelectedVideo(null)
                      setFormData((prev) => ({ ...prev, promo_video_url: "" }))
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <VideoIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">Upload promo video</p>
                  <p className="text-xs text-gray-500 mb-4">Recommended: MP4, less than 50MB</p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    className="hidden"
                    id="promo-video-upload"
                    disabled={videoUploading || loading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("promo-video-upload")?.click()}
                    disabled={videoUploading || loading}
                  >
                    {videoUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Video
                      </>
                    )}
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="promo_video_url">Or enter video URL</Label>
                <Input
                  id="promo_video_url"
                  type="url"
                  placeholder="https://example.com/promo.mp4"
                  value={formData.promo_video_url}
                  onChange={(e) => {
                    updateFormData("promo_video_url", e.target.value)
                    if (e.target.value) {
                      setVideoPreview(e.target.value)
                    }
                  }}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loading || imageUploading || videoUploading || !formData.title || !formData.category || !formData.difficulty_level
              }
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Course"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
