"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { CertificateViewer } from "@/components/certificates/certificate-viewer"
import { Award } from "lucide-react"

interface Certificate {
  id: string
  certificate_number: string
  course_title: string
  course_thumbnail: string
  issued_at: string
  verification_url: string
  pdf_url: string
}

export default function StudentCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/student/certificates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCertificates(data)
      }
    } catch (error) {
      console.error("Error fetching certificates:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["student"]}>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
              <Award className="h-5 w-5 text-gold-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-navy-900 dark:text-white">My Certificates</h1>
              <p className="text-warm-gray-600 dark:text-warm-gray-300">Your earned certificates and achievements</p>
            </div>
          </div>
        </div>

        <CertificateViewer certificates={certificates} />
      </div>
    </ProtectedRoute>
  )
}
