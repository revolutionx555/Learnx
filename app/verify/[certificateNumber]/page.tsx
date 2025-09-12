"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, CheckCircle, XCircle, Calendar, Clock, User, BookOpen } from "lucide-react"
import { useParams } from "next/navigation"

interface CertificateVerification {
  valid: boolean
  certificate?: {
    certificateNumber: string
    studentName: string
    courseName: string
    instructorName: string
    issuedAt: string
    duration: number
  }
}

export default function CertificateVerificationPage() {
  const params = useParams()
  const certificateNumber = params.certificateNumber as string
  const [verification, setVerification] = useState<CertificateVerification | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (certificateNumber) {
      verifyCertificate()
    }
  }, [certificateNumber])

  const verifyCertificate = async () => {
    try {
      const response = await fetch(`/api/certificates/verify/${certificateNumber}`)
      const data = await response.json()
      setVerification(data)
    } catch (error) {
      console.error("Error verifying certificate:", error)
      setVerification({ valid: false })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    return `${hours} hours`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Certificate Verification</h1>
          <p className="text-muted-foreground">Verify the authenticity of Learn X certificates</p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              {verification?.valid ? (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              )}
            </div>

            <CardTitle className="text-2xl">
              {verification?.valid ? "Valid Certificate" : "Invalid Certificate"}
            </CardTitle>

            <CardDescription>
              Certificate ID: <span className="font-mono">{certificateNumber}</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            {verification?.valid && verification.certificate ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      Student Name
                    </div>
                    <p className="font-semibold">{verification.certificate.studentName}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      Course
                    </div>
                    <p className="font-semibold">{verification.certificate.courseName}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      Instructor
                    </div>
                    <p className="font-semibold">{verification.certificate.instructorName}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Issue Date
                    </div>
                    <p className="font-semibold">{formatDate(verification.certificate.issuedAt)}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Course Duration
                    </div>
                    <p className="font-semibold">{formatDuration(verification.certificate.duration)}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="h-4 w-4" />
                      Status
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground text-center">
                    This certificate has been verified as authentic and was issued by Learn X. The holder has
                    successfully completed the specified course requirements.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  This certificate could not be verified. It may be invalid, expired, or the certificate number may be
                  incorrect.
                </p>
                <p className="text-sm text-muted-foreground">
                  If you believe this is an error, please contact our support team.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
