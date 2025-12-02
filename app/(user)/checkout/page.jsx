// app/checkout/page.jsx
import { Suspense } from "react";
import CheckoutPageContent from "./content";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Checkout | Topeve",
  description: "Complete your purchase securely with our encrypted checkout.",
};

function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-10 w-48 bg-taupe/20 rounded-lg mb-8 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-white rounded-2xl animate-pulse"
              />
            ))}
          </div>
          <div className="h-96 bg-white rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutPageContent />
    </Suspense>
  );
}
