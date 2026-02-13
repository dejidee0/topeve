// app/order-processing/page.jsx
"use client";

import { Suspense } from "react";
import OrderProcessingContent from "./content";

export default function OrderProcessingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <OrderProcessingContent />
    </Suspense>
  );
}
