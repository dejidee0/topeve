'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

export default function AccountPage() {
  return (
    <div className="container py-24">
      <div className="max-w-md mx-auto text-center space-y-6">
        <User className="h-16 w-16 mx-auto text-muted" />
        <h1 className="font-display text-h2 tracking-tightest">My Account</h1>
        <p className="text-muted">
          Sign in to view your orders, manage your profile, and track your wishlist.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-accent hover:bg-accent-600 text-bg uppercase tracking-caps">
            Sign In
          </Button>
          <Button size="lg" variant="outline" className="uppercase tracking-caps">
            Create Account
          </Button>
        </div>
        <div className="pt-8">
          <Link href="/shop" className="text-sm text-accent hover:underline uppercase tracking-caps">
            Continue Shopping →
          </Link>
        </div>
      </div>
    </div>
  );
}
