// app/product/[slug]/not-found.jsx
import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <Search size={64} className="mx-auto text-brand/30" />
        </div>
        <h1 className="font-heading text-4xl text-brand mb-4">
          Product Not Found
        </h1>
        <p className="text-charcoal/70 mb-8">
          We couldn&#39;t find the product you&lsquo;re looking for. It may have
          been removed or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="px-6 py-3 bg-brand text-cream rounded-full font-semibold hover:bg-gold hover:text-brand transition-all duration-300"
          >
            Browse All Products
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-brand text-brand rounded-full font-semibold hover:bg-brand hover:text-cream transition-all duration-300"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
