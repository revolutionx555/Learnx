import { type NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { db } from "@/lib/database"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    const stripe = getStripe()

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const { courseId, userId } = paymentIntent.metadata

  if (courseId && userId) {
    // Create enrollment
    await db.query(
      `INSERT INTO enrollments (user_id, course_id, enrolled_at, status, payment_intent_id)
       VALUES ($1, $2, NOW(), 'active', $3)
       ON CONFLICT (user_id, course_id) DO NOTHING`,
      [userId, courseId, paymentIntent.id],
    )

    // Create payment record
    await db.query(
      `INSERT INTO payments (user_id, course_id, stripe_payment_intent_id, amount, currency, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'completed', NOW())`,
      [userId, courseId, paymentIntent.id, paymentIntent.amount, paymentIntent.currency],
    )
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  // Get user by customer ID
  const user = await db.query("SELECT id FROM users WHERE stripe_customer_id = $1", [customerId])

  if (user.rows.length > 0) {
    const userId = user.rows[0].id

    await db.query(
      `INSERT INTO subscriptions (user_id, stripe_subscription_id, stripe_customer_id, status, current_period_start, current_period_end, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (stripe_subscription_id)
       DO UPDATE SET 
         status = $4,
         current_period_start = $5,
         current_period_end = $6,
         updated_at = NOW()`,
      [
        userId,
        subscription.id,
        customerId,
        subscription.status,
        new Date(subscription.current_period_start * 1000),
        new Date(subscription.current_period_end * 1000),
      ],
    )
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await db.query("UPDATE subscriptions SET status = 'canceled', updated_at = NOW() WHERE stripe_subscription_id = $1", [
    subscription.id,
  ])
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string

  if (subscriptionId) {
    await db.query("UPDATE subscriptions SET status = 'active', updated_at = NOW() WHERE stripe_subscription_id = $1", [
      subscriptionId,
    ])
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string

  if (subscriptionId) {
    await db.query(
      "UPDATE subscriptions SET status = 'past_due', updated_at = NOW() WHERE stripe_subscription_id = $1",
      [subscriptionId],
    )
  }
}
