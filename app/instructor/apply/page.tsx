"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, CheckCircle, User, FileText, Award, Globe } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface InstructorApplication {
  bio: string
  expertise_areas: string[]
  teaching_experience: string
  education_background: string
  portfolio_url: string
  linkedin_url: string
  cv_file?: File
  sample_content_url: string
  motivation: string
}

export default function InstructorApplicationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [cvFile, setCvFile] = useState<File | null>(null)

  const [formData, setFormData] = useState<InstructorApplication>({
    bio: "",
    expertise_areas: [],
    teaching_experience: "",
    education_background: "",
    portfolio_url: "",
    linkedin_url: "",
    sample_content_url: "",
    motivation: "",
  })

  const expertiseOptions = [
    "Programming & Development",
    "Web Development",
    "Mobile Development",
    "Data Science & Analytics",
    "Machine Learning & AI",
    "Design & UX/UI",
    "Digital Marketing",
    "Business & Entrepreneurship",
    "Photography & Videography",
    "Music & Audio Production",
    "Language Learning",
    "Health & Fitness",
    "Personal Development",
    "Finance & Investing",
    "Project Management",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setError("")
    setLoading(true)

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append("bio", formData.bio)
      submitData.append("expertise_areas", JSON.stringify(formData.expertise_areas))
      submitData.append("teaching_experience", formData.teaching_experience)
      submitData.append("education_background", formData.education_background)
      submitData.append("portfolio_url", formData.portfolio_url)
      submitData.append("linkedin_url", formData.linkedin_url)
      submitData.append("sample_content_url", formData.sample_content_url)
      submitData.append("motivation", formData.motivation)
      submitData.append("user_id", user.id)

      if (cvFile) {
        submitData.append("cv_file", cvFile)
      }

      const response = await fetch("/api/instructor/apply", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: submitData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit application")
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application")
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: keyof InstructorApplication, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleExpertiseChange = (expertise: string) => {
    const current = formData.expertise_areas
    if (current.includes(expertise)) {
      updateFormData(
        "expertise_areas",
        current.filter((item) => item !== expertise),
      )
    } else {
      updateFormData("expertise_areas", [...current, expertise])
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCvFile(file)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in becoming an instructor. We'll review your application and get back to you
              within 3-5 business days.
            </p>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Become an Instructor</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your expertise with thousands of learners worldwide. Join our community of passionate educators.
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              Instructor Application
            </CardTitle>
            <CardDescription>
              Tell us about yourself and your teaching experience. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio *</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your professional background, experience, and what makes you passionate about teaching..."
                    value={formData.bio}
                    onChange={(e) => updateFormData("bio", e.target.value)}
                    rows={4}
                    required
                    disabled={loading}
                  />
                  <p className="text-sm text-muted-foreground">Minimum 100 characters</p>
                </div>

                <div className="space-y-2">
                  <Label>Areas of Expertise *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {expertiseOptions.map((expertise) => (
                      <label key={expertise} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.expertise_areas.includes(expertise)}
                          onChange={() => handleExpertiseChange(expertise)}
                          className="rounded border-gray-300"
                          disabled={loading}
                        />
                        <span className="text-sm">{expertise}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Select at least 2 areas</p>
                </div>
              </div>

              {/* Experience & Education */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Experience & Education</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teaching_experience">Teaching Experience *</Label>
                  <Textarea
                    id="teaching_experience"
                    placeholder="Describe your teaching experience, including formal and informal education, workshops, mentoring, etc..."
                    value={formData.teaching_experience}
                    onChange={(e) => updateFormData("teaching_experience", e.target.value)}
                    rows={3}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education_background">Education Background *</Label>
                  <Textarea
                    id="education_background"
                    placeholder="Your educational qualifications, certifications, degrees, and relevant training..."
                    value={formData.education_background}
                    onChange={(e) => updateFormData("education_background", e.target.value)}
                    rows={3}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cv_file">Upload CV/Resume</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="cv_file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("cv_file")?.click()}
                      disabled={loading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {cvFile ? cvFile.name : "Choose File"}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">PDF, DOC, or DOCX (max 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Portfolio & Links */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Portfolio & Links</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="portfolio_url">Portfolio Website</Label>
                    <Input
                      id="portfolio_url"
                      type="url"
                      placeholder="https://yourportfolio.com"
                      value={formData.portfolio_url}
                      onChange={(e) => updateFormData("portfolio_url", e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                    <Input
                      id="linkedin_url"
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={formData.linkedin_url}
                      onChange={(e) => updateFormData("linkedin_url", e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sample_content_url">Sample Teaching Content</Label>
                  <Input
                    id="sample_content_url"
                    type="url"
                    placeholder="Link to a video, article, or other content that showcases your teaching style"
                    value={formData.sample_content_url}
                    onChange={(e) => updateFormData("sample_content_url", e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-sm text-muted-foreground">
                    YouTube video, blog post, or any content that demonstrates your teaching ability
                  </p>
                </div>
              </div>

              {/* Motivation */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Motivation</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">Why do you want to teach on Learn X? *</Label>
                  <Textarea
                    id="motivation"
                    placeholder="Share your motivation for teaching, what you hope to achieve, and how you plan to help students succeed..."
                    value={formData.motivation}
                    onChange={(e) => updateFormData("motivation", e.target.value)}
                    rows={4}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.bio ||
                    formData.expertise_areas.length < 2 ||
                    !formData.teaching_experience ||
                    !formData.education_background ||
                    !formData.motivation
                  }
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
