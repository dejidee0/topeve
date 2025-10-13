'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SiteFooter() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', { firstName, lastName, email });
  };

  return (
    <footer className="bg-card border-t border-border mt-24">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="font-display text-h3 mb-4">TopeveCreation</h3>
            <p className="text-sm text-muted leading-relaxed">
              Curating the finest selection of African fashion, beauty, and lifestyle pieces.
              Each item tells a story of craftsmanship and cultural heritage.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-caps mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search" className="text-muted hover:text-accent transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-muted hover:text-accent transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/gift-card-balance" className="text-muted hover:text-accent transition-colors">
                  Gift Card Balance
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted hover:text-accent transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-caps mb-4">Follow Us</h4>
            <div className="flex gap-4 mb-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-caps mb-4">Get Our Newsletter!</h4>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-bg"
                required
              />
              <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-bg"
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-bg"
                required
              />
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent-600 text-bg uppercase tracking-caps text-sm"
              >
                Sign Up
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} TopeveCreation. All rights reserved.
            </p>
            <div className="flex gap-4 items-center">
              <span className="text-xs text-muted uppercase tracking-caps">We Accept</span>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-bg border border-border rounded text-xs">Visa</div>
                <div className="px-3 py-1 bg-bg border border-border rounded text-xs">Mastercard</div>
                <div className="px-3 py-1 bg-bg border border-border rounded text-xs">Paystack</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
