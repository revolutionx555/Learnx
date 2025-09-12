"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Mail } from "lucide-react"
import Link from "next/link"

export default function ApplicationPendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Under Review</h2>
          <p className="text-gray-600 mb-6">
            Your instructor application is currently being reviewed by our team. We'll notify you via email once a
            decision has been made.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Mail className="h-4 w-4" />
              <span className="font-medium">What's Next?</span>
            </div>
            <ul className="text-sm text-blue-600 space-y-1 text-left">
              <li>• Review typically takes 3-5 business days</li>
              <li>• You'll receive an email notification</li>
              <li>• Check your spam folder just in case</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
