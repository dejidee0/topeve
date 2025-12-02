// lib/utils/whatsapp.js

/**
 * Format order details for WhatsApp message
 */
export function formatOrderMessage(order, orderItems) {
  const orderNumber = order.order_number;
  const customerName = order.customer_name;
  const customerPhone = order.customer_phone;
  const customerEmail = order.customer_email;

  // Format shipping address
  const shippingAddress = [
    order.shipping_address_line1,
    order.shipping_address_line2,
    order.shipping_city,
    order.shipping_state,
    order.shipping_postal_code,
  ]
    .filter(Boolean)
    .join(", ");

  // Format items list
  const itemsList = orderItems
    .map((item, index) => {
      const itemTotal = (item.total_price / 100).toLocaleString();
      return `${index + 1}. ${item.product_name}
   - Quantity: ${item.quantity}
   - Size: ${item.size || "N/A"}
   - Color: ${item.color || "N/A"}
   - Price: ₦${itemTotal}`;
    })
    .join("\n\n");

  // Format totals
  const subtotal = (order.subtotal / 100).toLocaleString();
  const shipping = (order.shipping_fee / 100).toLocaleString();
  const total = (order.total / 100).toLocaleString();

  // Create message
  const message = `🎉 *NEW ORDER RECEIVED - TOPEVE*

📋 *Order Details:*
Order Number: ${orderNumber}
Payment Status: ${order.payment_status.toUpperCase()}
Payment Method: ${order.payment_method || "Paystack"}

👤 *Customer Information:*
Name: ${customerName}
Phone: ${customerPhone}
Email: ${customerEmail}

📦 *Shipping Address:*
${shippingAddress}

🛍️ *Order Items:*
${itemsList}

💰 *Order Summary:*
Subtotal: ₦${subtotal}
Shipping: ₦${shipping}
Total: ₦${total}

📝 *Customer Notes:*
${order.customer_notes || "None"}

⏰ Order placed: ${new Date(order.created_at).toLocaleString("en-NG", {
    dateStyle: "full",
    timeStyle: "short",
  })}

Please process this order as soon as possible.`;

  return message;
}

/**
 * Send WhatsApp notification via WhatsApp Business API or direct link
 * Using WhatsApp Web link method (works without API key)
 */
export function sendWhatsAppNotification(phoneNumber, message) {
  // Remove any non-numeric characters from phone number
  const cleanPhone = phoneNumber.replace(/\D/g, "");

  // Ensure phone number has country code (234 for Nigeria)
  const fullPhone = cleanPhone.startsWith("234")
    ? cleanPhone
    : cleanPhone.startsWith("0")
    ? "234" + cleanPhone.slice(1)
    : "234" + cleanPhone;

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);

  // Create WhatsApp link
  const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodedMessage}`;

  console.log("📱 WhatsApp notification URL generated:", whatsappUrl);

  return whatsappUrl;
}
