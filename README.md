# TopeveCreation — Premium African Fashion E-commerce

A beautiful, editorial-first e-commerce website for African fashion and lifestyle products, built with Next.js 13, TypeScript, Tailwind CSS, and Supabase.

## Overview

TopeveCreation is a premium e-commerce platform that closely emulates the elegant design and user experience of high-end fashion websites like ozinna.com. The site features:

- **Editorial-first design** with large hero images, clean typography, and generous whitespace
- **Full product catalog** with advanced filtering, sorting, and search
- **Collection pages** for Ready to Wear (Men, Women, Kids, Bridal Shower), Beauty & Hair, Accessories, Jewelry, Cosmetics, and Sale items
- **Product detail pages** with image galleries, variant selection, and detailed information
- **Blog/Journal** section for content marketing
- **Responsive design** optimized for all devices
- **Premium aesthetics** with Playfair Display and Inter fonts, gold accent colors, and refined black/white palette

## Tech Stack

- **Framework**: Next.js 13 (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (ready for implementation)
- **Image Hosting**: Stock images from Pexels (production would use Supabase Storage)
- **Currency**: Nigerian Naira (₦)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### 1. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under Settings > API.

### 2. Database Setup

The database schema has already been created via the Supabase migration. Your database includes:

**Tables:**
- `categories` — Product categories with hierarchical support
- `brands` — Designer/brand information
- `products` — Main product catalog
- `product_images` — Product image galleries
- `blog_posts` — Editorial/blog content
- `profiles` — Customer profiles (linked to auth.users)
- `addresses` — Customer shipping addresses

**Sample Data:**
The database has been seeded with:
- 6 parent categories + 4 subcategories
- 8 brands
- 24 sample products across all categories
- 3 blog posts with images

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## Project Structure

```
├── app/
│   ├── page.tsx                      # Homepage with hero, new arrivals, categories, blog
│   ├── shop/page.tsx                 # All products with filters and sorting
│   ├── product/[slug]/page.tsx       # Product detail page
│   ├── ready-to-wear/
│   │   ├── men/page.tsx             # Men's collection
│   │   └── women/page.tsx           # Women's collection
│   ├── about/page.tsx                # About page with brand story
│   ├── cart/page.tsx                 # Shopping cart
│   └── account/page.tsx              # Customer account
├── components/
│   ├── site-header.tsx              # Header with navigation and search
│   ├── site-footer.tsx              # Footer with newsletter form
│   ├── announcement-bar.tsx         # Top announcement banner
│   ├── product-card.tsx             # Product card with hover effects
│   ├── product-grid.tsx             # Responsive product grid
│   ├── filter-sidebar.tsx           # Shop page filter sidebar
│   └── ui/                          # shadcn/ui components
├── lib/
│   ├── supabase.ts                  # Supabase client
│   ├── database.types.ts            # TypeScript types for database
│   ├── format.ts                    # Formatting utilities (price, date)
│   └── utils.ts                     # Utility functions
└── app/globals.css                   # Global styles and CSS variables
```

## Design System

### Color Palette

```css
--tc-bg:        #ffffff  /* Background */
--tc-fg:        #111111  /* Body text */
--tc-muted:     #6b7280  /* Captions/meta */
--tc-border:    #e5e7eb  /* Borders */
--tc-card:      #fafafa  /* Card backgrounds */
--tc-accent:    #C9A84A  /* Gold accent */
```

### Typography

- **Display font**: Playfair Display (headings)
- **Body font**: Inter (paragraphs, UI)
- **Tracking**: Tight on headings (-0.02em), wide on uppercase labels (0.08em)

### Spacing

Consistent 8px spacing system: 4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 96px

### Components

All UI components follow the ozinna.com aesthetic:
- **Header**: Centered logo, thin navigation bar, right-aligned icons
- **Product Cards**: 4:5 aspect ratio images, hover zoom effect, brand line, pricing
- **Filters**: Sticky left sidebar with accordion sections
- **Badges**: Uppercase tracking for "PRE-ORDER" and sale badges
- **Buttons**: Gold accent primary, outline secondary

## Key Features

### Homepage
- Full-bleed hero collage (3-4 large images)
- New Arrivals section (4-column grid)
- "Explore Your Style" editorial section
- Category tiles (8 square tiles)
- Blog preview (3 latest posts)

### Shop Page
- Left sidebar with filters (availability, brand, price range)
- Right product grid (3-4 columns responsive)
- Sort dropdown (date, price)
- Real-time filtering

### Product Detail Page
- Large image gallery with thumbnails
- Product information (brand, title, price, description)
- Add to Cart / Pre-Order buttons
- Delivery & Returns accordion
- Related products section

### Collection Pages
- Hero banner for each collection
- Filtered product grid
- Editorial copy for context

### About Page
- Two-column editorial layout
- Brand values section
- Image blocks with captions

## Database Schema

### Products Table
```sql
id              uuid (primary key)
slug            text (unique)
title           text
brand_id        uuid (foreign key)
category_id     uuid (foreign key)
description     text
status          text (active, draft)
price_cents     int (price in kobo/minor units)
compare_at_cents int (original price for sales)
currency        text (default: NGN)
preorder        boolean
in_stock        boolean
created_at      timestamptz
```

### Row Level Security (RLS)
- **Products, Categories, Brands, Blog**: Public read access
- **Profiles**: Users can only access their own profile
- **Addresses**: Users can only manage their own addresses

## Customization

### Adding New Products
Products can be added via SQL or through the Supabase dashboard:

```sql
INSERT INTO products (slug, title, brand_id, category_id, description, price_cents, in_stock)
VALUES ('product-slug', 'Product Title', 'brand_uuid', 'category_uuid', 'Description', 5000000, true);
```

Remember: price_cents is in kobo (100 kobo = ₦1), so ₦50,000 = 5000000 kobo.

### Adding Product Images
```sql
INSERT INTO product_images (product_id, url, alt, sort_order)
VALUES ('product_uuid', 'https://example.com/image.jpg', 'Alt text', 0);
```

### Updating Brand Colors
Edit `/app/globals.css` to change the accent color:
```css
--tc-accent: #C9A84A;  /* Change this value */
```

## Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables (Supabase URL and keys)
4. Deploy

### Environment Variables
Make sure these are set in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Future Enhancements

- Shopping cart state management with local storage
- Supabase Auth integration for user accounts
- Checkout flow with Paystack integration
- Order management system
- Admin dashboard for product management
- Advanced search with Algolia or Supabase full-text search
- Wishlist functionality
- Product reviews and ratings
- Email notifications for orders
- Inventory management

## License

Private project for TopeveCreation.

## Support

For questions or issues, contact the development team.
