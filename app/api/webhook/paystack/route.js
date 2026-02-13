// app/api/webhook/paystack/route.js
import { createClient } from "@/supabase/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("x-paystack-signature");

    console.log("📨 Webhook received");

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      console.error("❌ Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    console.log("📨 Event type:", event.event);

    // Handle charge.success event
    if (event.event === "charge.success") {
      const { reference, amount, customer, status } = event.data;

      console.log("✅ Payment successful webhook:", reference);

      const supabase = await createClient();

      // Find the order by reference (order_number)
      const { data: order, error: findError } = await supabase
        .from("orders")
        .select("id, order_number, payment_status, customer_email")
        .eq("order_number", reference)
        .single();

      if (findError || !order) {
        console.error("❌ Order not found for reference:", reference);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Check if already processed
      if (order.payment_status === "paid") {
        console.log("ℹ️ Order already marked as paid:", reference);
        return NextResponse.json({
          success: true,
          message: "Already processed",
        });
      }

      // Update order status
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "processing",
          paid_at: new Date().toISOString(),
          paystack_reference: reference,
          paystack_amount: amount,
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("❌ Error updating order:", updateError);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
      }

      console.log("✅ Order updated to paid:", order.order_number);

      // Send confirmation email (fire and forget)
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

      return NextResponse.json({ success: true, message: "Order updated" });
    }

    // Handle other events
    console.log("ℹ️ Unhandled event type:", event.event);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
