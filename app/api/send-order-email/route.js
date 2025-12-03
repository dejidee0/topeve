// app/api/send-order-email/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  generateOrderEmailHTML,
  generateAdminNotificationHTML,
} from "@/utils/email-template";

export async function POST(request) {
  try {
    const { order, orderItems } = await request.json();

    console.log(
      "📧 [EmailAPI] Processing email notification for order:",
      order.order_number
    );

    // Create transporter with Gmail - Latest Configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use TLS (false for port 587, true for port 465)
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // App Password (not regular password)
      },
    });

    // Verify transporter configuration
    console.log("🔍 [EmailAPI] Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ [EmailAPI] SMTP connection verified");

    // Generate email HTML
    const customerHTML = generateOrderEmailHTML(order, orderItems);
    const adminHTML = generateAdminNotificationHTML(order, orderItems);

    // Send email to customer
    console.log(
      "📧 [EmailAPI] Sending customer email to:",
      order.customer_email
    );
    const customerEmail = await transporter.sendMail({
      from: {
        name: "Topeve",
        address: process.env.GMAIL_USER,
      },
      to: order.customer_email,
      subject: `Order Confirmation - ${order.order_number}`,
      html: customerHTML,
      // Optional: Add text version as fallback
      text: `Thank you for your order ${order.order_number}. Your order has been confirmed.`,
    });

    console.log("✅ [EmailAPI] Customer email sent:", customerEmail.messageId);

    // Send notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER;
    console.log("📧 [EmailAPI] Sending admin notification to:", adminEmail);

    const adminEmailResult = await transporter.sendMail({
      from: {
        name: "Topeve Orders",
        address: process.env.GMAIL_USER,
      },
      to: adminEmail,
      subject: `🎉 New Order: ${order.order_number} - ${order.customer_name}`,
      html: adminHTML,
      // High priority for admin notifications
      priority: "high",
    });

    console.log("✅ [EmailAPI] Admin email sent:", adminEmailResult.messageId);

    return NextResponse.json({
      success: true,
      message: "Emails sent successfully",
      customerEmailId: customerEmail.messageId,
      adminEmailId: adminEmailResult.messageId,
    });
  } catch (error) {
    console.error("❌ [EmailAPI] Error sending emails:", error);

    // Provide detailed error information
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.code || "Unknown error",
      },
      { status: 500 }
    );
  }
}
