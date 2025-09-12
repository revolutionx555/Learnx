"use client"

import type React from "react"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, CreditCard, Lock, Check } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: string
  features: string[]
  priceId: string
  popular?: boolean
}

const plans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 9.99,
    interval: "month",
    priceId: "price_basic_monthly",
    features: ["Access to basic courses", "Community support", "Mobile app access"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 19.99,
    interval: "month",
    priceId: "price_pro_monthly",
    popular: true,
    features: ["Access to all courses", "Priority support", "Downloadable resources", "Certificates", "Live sessions"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 49.99,
    interval: "month",
    priceId: "price_enterprise_monthly",
    features: ["Everything in Pro", "Custom learning paths", "Analytics dashboard", "Team management", "API access"],
  },
]

interface SubscriptionFormProps {
  onSuccess: () => void
}

function SubscriptionFormInner({ onSuccess }: SubscriptionFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(plans[1])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error("Card element not found")
      }

      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      })

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message)
      }

      // Create subscription
      const token = localStorage.getItem("token")
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          priceId: selectedPlan.priceId,
          paymentMethodId: paymentMethod.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create subscription")
      }

      const { clientSecret, status } = await response.json()

      if (status === "requires_action" && clientSecret) {
        const { error: confirmError } = await stripe.confirmCardPayment(clientSecret)
        if (confirmError) {
          throw new Error(confirmError.message)
        }
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Plan Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`cursor-pointer transition-all ${
              selectedPlan.id === plan.id ? "ring-2 ring-navy-600 border-navy-600" : "hover:border-navy-300"
            } ${plan.popular ? "relative" : ""}`}
            onClick={() => setSelectedPlan(plan)}
          >
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gold-500 text-navy-900">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-sm font-normal text-muted-foreground">/{plan.interval}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">{selectedPlan.name} Plan</p>
            <p className="text-sm text-muted-foreground">Billed monthly • Cancel anytime</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${selectedPlan.price}</p>
            <p className="text-sm text-muted-foreground">per month</p>
          </div>
        </div>

        <Button type="submit" disabled={!stripe || loading} className="w-full" size="lg">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Subscribe for ${selectedPlan.price}/month
            </>
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            <Lock className="h-3 w-3" />
            Secured by Stripe • Cancel anytime
          </p>
        </div>
      </form>
    </div>
  )
}

export function SubscriptionForm(props: SubscriptionFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <SubscriptionFormInner {...props} />
    </Elements>
  )
}
