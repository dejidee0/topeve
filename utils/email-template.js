// lib/utils/email-template.js

export function generateOrderEmailHTML(order, orderItems) {
  const formatPrice = (priceInKobo) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(priceInKobo / 100);
  };

  const shippingAddress = [
    order.shipping_address_line1,
    order.shipping_address_line2,
    order.shipping_city,
    order.shipping_state,
    order.shipping_postal_code,
  ]
    .filter(Boolean)
    .join(", ");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Topeve</title>
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: #2C1810; color: #FAF7F2; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 32px; font-family: 'Georgia', serif; }
    .content { padding: 30px; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 18px; font-weight: bold; color: #2C1810; margin-bottom: 15px; border-bottom: 2px solid #D4AF7F; padding-bottom: 5px; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .info-label { font-weight: bold; color: #666; }
    .info-value { color: #333; }
    .item { display: flex; align-items: center; padding: 15px; background: #FAF7F2; border-radius: 8px; margin-bottom: 10px; }
    .item-image { width: 80px; height: 80px; object-fit: cover; border-radius: 5px; margin-right: 15px; }
    .item-details { flex: 1; }
    .item-name { font-weight: bold; color: #2C1810; margin-bottom: 5px; }
    .item-meta { font-size: 14px; color: #666; }
    .item-price { font-weight: bold; color: #2C1810; text-align: right; }
    .total-row { display: flex; justify-content: space-between; padding: 15px 0; font-size: 18px; }
    .total-row.grand { background: #2C1810; color: #FAF7F2; padding: 20px; border-radius: 8px; font-size: 24px; font-weight: bold; }
    .button { display: inline-block; padding: 15px 30px; background: #2C1810; color: #FAF7F2; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .footer { background: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .success-icon { font-size: 48px; text-align: center; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>TOPEVE</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">Luxury Fashion</p>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="success-icon">✅</div>
      <h2 style="text-align: center; color: #2C1810; margin-bottom: 10px;">Order Confirmed!</h2>
      <p style="text-align: center; color: #666; margin-bottom: 30px;">
        Thank you for your purchase, ${
          order.customer_name
        }. Your order has been received and is being processed.
      </p>

      <!-- Order Details -->
      <div class="section">
        <div class="section-title">Order Information</div>
        <div class="info-row">
          <span class="info-label">Order Number:</span>
          <span class="info-value">${order.order_number}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Order Date:</span>
          <span class="info-value">${new Date(
            order.created_at
          ).toLocaleDateString("en-NG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Payment Status:</span>
          <span class="info-value" style="color: #22c55e; font-weight: bold;">PAID</span>
        </div>
      </div>

      <!-- Order Items -->
      <div class="section">
        <div class="section-title">Order Items</div>
        ${orderItems
          .map(
            (item) => `
          <div class="item">
            <img src="${
              item.product_image || "https://via.placeholder.com/80"
            }" alt="${item.product_name}" class="item-image">
            <div class="item-details">
              <div class="item-name">${item.product_name}</div>
              <div class="item-meta">
                Quantity: ${item.quantity}
                ${item.size ? ` • Size: ${item.size}` : ""}
                ${item.color ? ` • Color: ${item.color}` : ""}
              </div>
            </div>
            <div class="item-price">${formatPrice(item.total_price)}</div>
          </div>
        `
          )
          .join("")}
      </div>

      <!-- Order Summary -->
      <div class="section">
        <div class="section-title">Order Summary</div>
        <div class="total-row">
          <span>Subtotal:</span>
          <span>${formatPrice(order.subtotal)}</span>
        </div>
        <div class="total-row">
          <span>Shipping:</span>
          <span>${
            order.shipping_fee === 0 ? "FREE" : formatPrice(order.shipping_fee)
          }</span>
        </div>
        ${
          order.tax > 0
            ? `
          <div class="total-row">
            <span>Tax:</span>
            <span>${formatPrice(order.tax)}</span>
          </div>
        `
            : ""
        }
        <div class="total-row grand">
          <span>Total:</span>
          <span>${formatPrice(order.total)}</span>
        </div>
      </div>

      <!-- Shipping Address -->
      <div class="section">
        <div class="section-title">Shipping Address</div>
        <p style="margin: 0; line-height: 1.8;">
          <strong>${order.customer_name}</strong><br>
          ${shippingAddress}<br>
          ${order.shipping_country}
        </p>
        <p style="margin: 15px 0 0 0;">
          <strong>Phone:</strong> ${order.customer_phone}<br>
          <strong>Email:</strong> ${order.customer_email}
        </p>
      </div>

      ${
        order.customer_notes
          ? `
        <div class="section">
          <div class="section-title">Order Notes</div>
          <p style="margin: 0; background: #f8f8f8; padding: 15px; border-radius: 5px;">
            ${order.customer_notes}
          </p>
        </div>
      `
          : ""
      }

      <!-- Next Steps -->
      <div class="section" style="background: #FFF9E6; padding: 20px; border-radius: 8px; border-left: 4px solid #D4AF7F;">
        <h3 style="margin: 0 0 10px 0; color: #2C1810;">📦 What's Next?</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>We're preparing your items for shipment</li>
          <li>You'll receive a tracking number within 24-48 hours</li>
          <li>Estimated delivery: 3-5 business days</li>
        </ul>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 0 0 10px 0;">Need help? Contact us at support@topeve.com</p>
      <p style="margin: 0; color: #999;">
        © ${new Date().getFullYear()} Topeve. All rights reserved.<br>
        Luxury Fashion • Lagos, Nigeria
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateAdminNotificationHTML(order, orderItems) {
  const formatPrice = (priceInKobo) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(priceInKobo / 100);
  };

  const shippingAddress = [
    order.shipping_address_line1,
    order.shipping_address_line2,
    order.shipping_city,
    order.shipping_state,
    order.shipping_postal_code,
  ]
    .filter(Boolean)
    .join(", ");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Order - ${order.order_number}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
    .container { max-width: 800px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: #22c55e; color: white; padding: 20px; border-radius: 5px; margin-bottom: 30px; }
    .alert { background: #FFF9E6; border-left: 4px solid #D4AF7F; padding: 15px; margin-bottom: 20px; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 18px; font-weight: bold; color: #2C1810; margin-bottom: 15px; border-bottom: 2px solid #D4AF7F; padding-bottom: 5px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f8f8f8; font-weight: bold; }
    .total { font-size: 20px; font-weight: bold; color: #2C1810; text-align: right; padding: 15px; background: #FAF7F2; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🎉 NEW ORDER RECEIVED</h1>
      <p style="margin: 10px 0 0 0;">Order #${order.order_number}</p>
    </div>

    <div class="alert">
      <strong>⚡ Action Required:</strong> Please process this order as soon as possible.
    </div>

    <div class="section">
      <div class="section-title">Order Details</div>
      <table>
        <tr><td><strong>Order Number:</strong></td><td>${
          order.order_number
        }</td></tr>
        <tr><td><strong>Order Date:</strong></td><td>${new Date(
          order.created_at
        ).toLocaleString("en-NG")}</td></tr>
        <tr><td><strong>Payment Status:</strong></td><td style="color: #22c55e; font-weight: bold;">PAID</td></tr>
        <tr><td><strong>Payment Method:</strong></td><td>Paystack</td></tr>
      </table>
    </div>

    <div class="section">
      <div class="section-title">Customer Information</div>
      <table>
        <tr><td><strong>Name:</strong></td><td>${order.customer_name}</td></tr>
        <tr><td><strong>Email:</strong></td><td><a href="mailto:${
          order.customer_email
        }">${order.customer_email}</a></td></tr>
        <tr><td><strong>Phone:</strong></td><td><a href="tel:${
          order.customer_phone
        }">${order.customer_phone}</a></td></tr>
      </table>
    </div>

    <div class="section">
      <div class="section-title">Shipping Address</div>
      <p style="margin: 0; line-height: 1.8; background: #f8f8f8; padding: 15px; border-radius: 5px;">
        <strong>${order.customer_name}</strong><br>
        ${shippingAddress}<br>
        ${order.shipping_country}
      </p>
    </div>

    <div class="section">
      <div class="section-title">Order Items</div>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Size</th>
            <th>Color</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${orderItems
            .map(
              (item) => `
            <tr>
              <td>${item.product_name}</td>
              <td>${item.product_sku || "N/A"}</td>
              <td>${item.size || "N/A"}</td>
              <td>${item.color || "N/A"}</td>
              <td>${item.quantity}</td>
              <td>${formatPrice(item.total_price)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>

    <div class="section">
      <div class="section-title">Order Summary</div>
      <table>
        <tr><td>Subtotal:</td><td style="text-align: right;">${formatPrice(
          order.subtotal
        )}</td></tr>
        <tr><td>Shipping:</td><td style="text-align: right;">${
          order.shipping_fee === 0 ? "FREE" : formatPrice(order.shipping_fee)
        }</td></tr>
        ${
          order.tax > 0
            ? `<tr><td>Tax:</td><td style="text-align: right;">${formatPrice(
                order.tax
              )}</td></tr>`
            : ""
        }
        <tr><td colspan="2" class="total">TOTAL: ${formatPrice(
          order.total
        )}</td></tr>
      </table>
    </div>

    ${
      order.customer_notes
        ? `
      <div class="section">
        <div class="section-title">Customer Notes</div>
        <p style="margin: 0; background: #FFF9E6; padding: 15px; border-radius: 5px; border-left: 4px solid #D4AF7F;">
          ${order.customer_notes}
        </p>
      </div>
    `
        : ""
    }
  </div>
</body>
</html>
  `;
}
