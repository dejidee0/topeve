// app/cart/page.jsx
import { Suspense } from "react";
import CartPageContent from "./content";

export const metadata = {
  title: "Shopping Cart | Topeve",
  description: "Review and manage your shopping cart items before checkout.",
};

function CartSkeleton() {
  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-10 w-48 bg-taupe/20 rounded-lg mb-8 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-white rounded-2xl animate-pulse"
              />
            ))}
          </div>
          <div className="h-96 bg-white rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartPageContent />
    </Suspense>
  );
}
