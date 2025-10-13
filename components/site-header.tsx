'use client';

import Link from 'next/link';
import { Search, User, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-bg border-b border-border/40">
      <div className="container">
        <div className="flex h-14 items-center justify-center">
          <Link href="/" className="font-display text-2xl font-semibold tracking-tightest">
            TopeveCreation
          </Link>
        </div>

        <nav className="flex h-12 items-center justify-between border-t border-border/40">
          <NavigationMenu className="flex-1">
            <NavigationMenuList className="space-x-6">
              <NavigationMenuItem>
                <Link href="/" className="text-sm uppercase tracking-caps hover:text-accent transition-colors">
                  Home
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm uppercase tracking-caps bg-transparent hover:bg-transparent hover:text-accent">
                  Ready to Wear
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/ready-to-wear/men"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent"
                        >
                          <div className="text-sm font-medium leading-none">Men</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/ready-to-wear/women"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent"
                        >
                          <div className="text-sm font-medium leading-none">Women</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/ready-to-wear/kids"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent"
                        >
                          <div className="text-sm font-medium leading-none">Kids</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/ready-to-wear/bridal-shower"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent"
                        >
                          <div className="text-sm font-medium leading-none">Bridal Shower</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/beauty-hair" className="text-sm uppercase tracking-caps hover:text-accent transition-colors">
                  Beauty & Hair
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/accessories" className="text-sm uppercase tracking-caps hover:text-accent transition-colors">
                  Accessories
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/jewelry" className="text-sm uppercase tracking-caps hover:text-accent transition-colors">
                  Jewelry
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/cosmetics" className="text-sm uppercase tracking-caps hover:text-accent transition-colors">
                  Cosmetics
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/sale" className="text-sm uppercase tracking-caps text-danger hover:text-danger/80 transition-colors">
                  Sale
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hover:text-accent transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link href="/account" className="hover:text-accent transition-colors" aria-label="Account">
              <User className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="hover:text-accent transition-colors relative" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-accent text-bg text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </nav>
      </div>

      {searchOpen && (
        <div className="absolute top-full left-0 w-full bg-bg border-b border-border shadow-soft">
          <div className="container py-6">
            <input
              type="search"
              placeholder="Search products..."
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSearchOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
}
