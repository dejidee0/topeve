'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const cartItems: any[] = [];

  if (cartItems.length === 0) {
    return (
      <div className="container py-24">
        <div className="max-w-md mx-auto text-center space-y-6">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted" />
          <h1 className="font-display text-h2 tracking-tightest">Your Cart is Empty</h1>
          <p className="text-muted">
            Discover our curated collection and add your favorite pieces to your cart.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent-600 text-bg uppercase tracking-caps">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="font-display text-h1 uppercase tracking-caps mb-8">Shopping Cart</h1>
    </div>
  );
}
