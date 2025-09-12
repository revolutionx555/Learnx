"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SubscriptionForm } from "@/components/payment/subscription-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SubscribePage() {
  const router = useRouter()
  const [success, setSuccess] = useState(false)

  const handleSuccess = () => {
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-900 mb-2">Welcome to Learn X Pro!</h1>
            <p className="text-muted-foreground mb-6">
              Your subscription is now active. You have access to all premium features and courses.
            </p>
            <div className="space-y-3">
              <Button onClick={() => router.push("/courses")} className="w-full">
                Explore Courses
              </Button>
              <Button variant="outline" onClick={() => router.push("/dashboard")} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-navy-900 mb-2">Choose Your Plan</h1>
            <p className="text-muted-foreground text-lg">
              Unlock unlimited access to our entire course library and premium features
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Subscribe to Learn X</CardTitle>
            </CardHeader>
            <CardContent>
              <SubscriptionForm onSuccess={handleSuccess} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
