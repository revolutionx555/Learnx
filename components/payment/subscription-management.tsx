"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, CreditCard, AlertTriangle, CheckCircle } from "lucide-react"

interface Subscription {
  id: string
  stripe_id: string
  status: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  plan: {
    name: string
    amount: number
    currency: string
    interval: string
  }
  payment_method: any
}

export function SubscriptionManagement() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/subscriptions/manage", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSubscription(data.subscription)
      }
    } catch (error) {
      console.error("Error fetching subscription:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscriptionAction = async (action: string) => {
    if (!subscription) return

    setActionLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/subscriptions/manage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action,
          subscriptionId: subscription.stripe_id,
        }),
      })

      if (response.ok) {
        await fetchSubscription()
      }
    } catch (error) {
      console.error("Error managing subscription:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string, cancelAtPeriodEnd: boolean) => {
    if (cancelAtPeriodEnd) {
      return <Badge variant="destructive">Canceling</Badge>
    }

    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "past_due":
        return <Badge variant="destructive">Past Due</Badge>
      case "canceled":
        return <Badge variant="secondary">Canceled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No active subscription found</p>
          <Button className="mt-4" onClick={() => (window.location.href = "/subscribe")}>
            Subscribe Now
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Subscription
            </CardTitle>
            {getStatusBadge(subscription.status, subscription.cancel_at_period_end)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="font-medium">{subscription.plan.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-medium">
                {formatCurrency(subscription.plan.amount, subscription.plan.currency)}/{subscription.plan.interval}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Period</p>
              <p className="font-medium">
                {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Billing</p>
              <p className="font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(subscription.current_period_end)}
              </p>
            </div>
          </div>

          {subscription.cancel_at_period_end && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your subscription will be canceled on {formatDate(subscription.current_period_end)}. You'll continue to
                have access until then.
              </AlertDescription>
            </Alert>
          )}

          {subscription.status === "past_due" && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your payment is past due. Please update your payment method to continue your subscription.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 pt-4">
            {subscription.cancel_at_period_end ? (
              <Button onClick={() => handleSubscriptionAction("reactivate")} disabled={actionLoading} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Reactivate Subscription
              </Button>
            ) : (
              <Button variant="destructive" onClick={() => handleSubscriptionAction("cancel")} disabled={actionLoading}>
                Cancel Subscription
              </Button>
            )}
            <Button variant="outline" disabled={actionLoading}>
              Update Payment Method
            </Button>
            <Button variant="outline" disabled={actionLoading}>
              Change Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
