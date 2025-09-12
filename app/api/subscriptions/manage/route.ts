import { type NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { verifyToken } from "@/lib/auth/jwt"
import { queryOne } from "@/lib/database/connection"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { action, subscriptionId } = await request.json()

    // Get user's subscription
    const subscription = await queryOne<any>(
      "SELECT * FROM subscriptions WHERE user_id = $1 AND stripe_subscription_id = $2",
      [payload.userId, subscriptionId],
    )

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    const stripe = getStripe()

    switch (action) {
      case "cancel":
        // Cancel subscription at period end
        const canceledSub = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        })

        await queryOne<any>(
          "UPDATE subscriptions SET status = 'canceled', cancel_at_period_end = true, updated_at = NOW() WHERE id = $1",
          [subscription.id],
        )

        return NextResponse.json({
          status: canceledSub.status,
          cancel_at_period_end: canceledSub.cancel_at_period_end,
          current_period_end: canceledSub.current_period_end,
        })

      case "reactivate":
        // Reactivate subscription
        const reactivatedSub = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: false,
        })

        await queryOne<any>(
          "UPDATE subscriptions SET status = 'active', cancel_at_period_end = false, updated_at = NOW() WHERE id = $1",
          [subscription.id],
        )

        return NextResponse.json({
          status: reactivatedSub.status,
          cancel_at_period_end: reactivatedSub.cancel_at_period_end,
        })

      case "change_plan":
        const { newPriceId } = await request.json()

        // Update subscription with new price
        const updatedSub = await stripe.subscriptions.update(subscriptionId, {
          items: [
            {
              id: subscription.stripe_subscription_item_id,
              price: newPriceId,
            },
          ],
          proration_behavior: "create_prorations",
        })

        return NextResponse.json({
          status: updatedSub.status,
          current_period_end: updatedSub.current_period_end,
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error managing subscription:", error)
    return NextResponse.json({ error: "Failed to manage subscription" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get user's active subscriptions
    const subscriptions = await queryOne<any>(
      `
      SELECT 
        s.*,
        u.email,
        u.name
      FROM subscriptions s
      JOIN users_sync u ON s.user_id = u.id
      WHERE s.user_id = $1 AND s.status IN ('active', 'past_due', 'canceled')
      ORDER BY s.created_at DESC
    `,
      [payload.userId],
    )

    if (!subscriptions) {
      return NextResponse.json({ subscriptions: [] })
    }

    const stripe = getStripe()

    // Get detailed subscription info from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptions.stripe_subscription_id, {
      expand: ["default_payment_method", "items.data.price.product"],
    })

    return NextResponse.json({
      subscription: {
        id: subscriptions.id,
        stripe_id: subscriptions.stripe_subscription_id,
        status: stripeSubscription.status,
        current_period_start: new Date(stripeSubscription.current_period_start * 1000),
        current_period_end: new Date(stripeSubscription.current_period_end * 1000),
        cancel_at_period_end: stripeSubscription.cancel_at_period_end,
        plan: {
          name: (stripeSubscription.items.data[0].price.product as any).name,
          amount: stripeSubscription.items.data[0].price.unit_amount,
          currency: stripeSubscription.items.data[0].price.currency,
          interval: stripeSubscription.items.data[0].price.recurring?.interval,
        },
        payment_method: stripeSubscription.default_payment_method,
      },
    })
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 })
  }
}
