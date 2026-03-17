// app/order-confirmation/page.jsx
import { Suspense } from "react";
import OrderConfirmationContent from "./content";

export const metadata = {
  title: "Order Confirmation | Topevekreation",
  description: "Thank you for your order!",
};

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
