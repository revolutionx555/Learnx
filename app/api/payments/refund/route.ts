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

    const { paymentIntentId, reason = "requested_by_customer" } = await request.json()

    // Verify user owns this payment
    const payment = await queryOne<any>(
      "SELECT * FROM transactions WHERE stripe_payment_intent_id = $1 AND user_id = $2",
      [paymentIntentId, payload.userId],
    )

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    if (payment.status === "refunded") {
      return NextResponse.json({ error: "Payment already refunded" }, { status: 400 })
    }

    const stripe = getStripe()

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason,
    })

    // Update transaction status
    await queryOne<any>("UPDATE transactions SET status = 'refunded', updated_at = NOW() WHERE id = $1", [payment.id])

    // Remove enrollment if it exists
    if (payment.course_id) {
      await queryOne<any>("DELETE FROM enrollments WHERE user_id = $1 AND course_id = $2", [
        payload.userId,
        payment.course_id,
      ])
    }

    return NextResponse.json({
      refundId: refund.id,
      amount: refund.amount,
      status: refund.status,
    })
  } catch (error) {
    console.error("Error processing refund:", error)
    return NextResponse.json({ error: "Failed to process refund" }, { status: 500 })
  }
}
