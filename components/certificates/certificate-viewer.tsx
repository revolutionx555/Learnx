"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Download, Share2, ExternalLink, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Certificate {
  id: string
  certificate_number: string
  course_title: string
  course_thumbnail: string
  issued_at: string
  verification_url: string
  pdf_url: string
}

interface CertificateViewerProps {
  certificates: Certificate[]
}

export function CertificateViewer({ certificates }: CertificateViewerProps) {
  const { toast } = useToast()
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDownload = async (certificate: Certificate) => {
    setDownloading(certificate.id)
    try {
      // In a real implementation, this would download the actual PDF
      const response = await fetch(`/api/certificates/download/${certificate.certificate_number}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `certificate-${certificate.certificate_number}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Certificate Downloaded",
          description: "Your certificate has been downloaded successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download certificate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloading(null)
    }
  }

  const handleShare = async (certificate: Certificate) => {
    try {
      await navigator.share({
        title: `Certificate - ${certificate.course_title}`,
        text: `I've completed ${certificate.course_title} and earned a certificate!`,
        url: certificate.verification_url,
      })
    } catch (error) {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(certificate.verification_url)
      toast({
        title: "Link Copied",
        description: "Certificate verification link copied to clipboard.",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (certificates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Award className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Complete courses to earn certificates and showcase your achievements.
          </p>
          <Button variant="outline">Browse Courses</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {certificates.map((certificate) => (
        <Card key={certificate.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-gold-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{certificate.course_title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(certificate.issued_at)}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Certificate ID:</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {certificate.certificate_number.slice(-8)}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => handleDownload(certificate)}
                disabled={downloading === certificate.id}
              >
                <Download className="h-4 w-4 mr-1" />
                {downloading === certificate.id ? "Downloading..." : "Download"}
              </Button>

              <Button size="sm" variant="outline" onClick={() => handleShare(certificate)}>
                <Share2 className="h-4 w-4" />
              </Button>

              <Button size="sm" variant="outline" asChild>
                <a href={certificate.verification_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
