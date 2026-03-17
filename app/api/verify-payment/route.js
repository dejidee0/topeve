// app/api/verify-payment/route.js
import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          error: "No reference provided",
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Check order status in database (webhook should have updated it)
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          products (name, image, sku)
        )
      `,
      )
      .eq("order_number", reference)
      .single();

    if (error || !order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      );
    }

    // If already paid (webhook processed it), return success
    if (order.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        order,
        message: "Payment verified",
        source: "webhook",
      });
    }

    // Fallback: Verify with Paystack API directly
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    if (!paystackResponse.ok) {
      return NextResponse.json({
        success: false,
        order,
        message: "Payment verification pending",
      });
    }

    const paystackData = await paystackResponse.json();

    if (paystackData.status && paystackData.data.status === "success") {

      // Update order (webhook might be delayed)
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "processing",
          paid_at: new Date().toISOString(),
          paystack_reference: reference,
          paystack_amount: paystackData.data.amount,
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("❌ Error updating order:", updateError);
      }

      // Fetch updated order
      const { data: updatedOrder } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            *,
            products (name, image, sku)
          )
        `,
        )
        .eq("id", order.id)
        .single();

      // Send email if not already sent
      if (order.customer_email) {
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-order-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            orderNumber: order.order_number,
          }),
        }).catch((err) => {
          console.error("❌ Email notification failed:", err);
        });
      }

      return NextResponse.json({
        success: true,
        order: updatedOrder || {
          ...order,
          payment_status: "paid",
          status: "processing",
        },
        message: "Payment verified and order updated",
        source: "api",
      });
    }

    // Payment not completed yet
    return NextResponse.json({
      success: false,
      order,
      message: "Payment not completed",
    });
  } catch (error) {
    console.error("❌ Verify payment error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Verification failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
