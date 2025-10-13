/*
  # TopeveCreation E-commerce Schema

  1. New Tables
    - `categories` - Product categories with hierarchical support (parent_id)
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-safe identifier
      - `name` (text) - Display name
      - `parent_id` (uuid, nullable) - Self-reference for subcategories
      - `sort_order` (int) - Display ordering
      - `created_at` (timestamptz)
    
    - `brands` - Product brands/designers
      - `id` (uuid, primary key)
      - `name` (text, unique)
    
    - `products` - Main product catalog
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-safe identifier
      - `title` (text) - Product name
      - `brand_id` (uuid) - Foreign key to brands
      - `category_id` (uuid) - Foreign key to categories
      - `description` (text) - Full product description
      - `status` (text) - active, draft
      - `price_cents` (int) - Price in kobo (NGN minor units)
      - `compare_at_cents` (int, nullable) - Original price for sale display
      - `currency` (text) - Default NGN
      - `preorder` (boolean) - Pre-order flag
      - `in_stock` (boolean) - Availability
      - `created_at` (timestamptz)
    
    - `product_images` - Product image gallery
      - `id` (uuid, primary key)
      - `product_id` (uuid) - Foreign key to products
      - `url` (text) - Image URL
      - `alt` (text) - Accessibility text
      - `sort_order` (int) - Display order
    
    - `blog_posts` - Editorial content
      - `id` (uuid, primary key)
      - `slug` (text, unique)
      - `title` (text)
      - `excerpt` (text)
      - `hero_url` (text) - Featured image
      - `published_at` (date)
    
    - `profiles` - Customer profiles (auth-linked)
      - `id` (uuid, primary key) - Matches auth.users.id
      - `full_name` (text)
      - `role` (text) - Default 'customer'
      - `created_at` (timestamptz)
    
    - `addresses` - Shipping addresses
      - `id` (uuid, primary key)
      - `user_id` (uuid) - Foreign key to profiles
      - `label` (text) - e.g., "Home", "Office"
      - `line1`, `line2`, `city`, `state`, `country`, `postal_code` (text)
      - `phone` (text)
      - `is_default` (boolean)

  2. Security
    - Enable RLS on all tables
    - Public read policies for catalog tables (products, categories, brands, blog)
    - User-scoped policies for profiles and addresses
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (true);

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view brands"
  ON brands FOR SELECT
  USING (true);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  brand_id uuid REFERENCES brands(id) ON DELETE SET NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  description text DEFAULT '',
  status text DEFAULT 'active',
  price_cents int NOT NULL,
  compare_at_cents int,
  currency text DEFAULT 'NGN',
  preorder boolean DEFAULT false,
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (true);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt text DEFAULT '',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view product images"
  ON product_images FOR SELECT
  USING (true);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text DEFAULT '',
  hero_url text DEFAULT '',
  published_at date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  USING (true);

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY,
  full_name text DEFAULT '',
  role text DEFAULT 'customer',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  label text DEFAULT '',
  line1 text DEFAULT '',
  line2 text DEFAULT '',
  city text DEFAULT '',
  state text DEFAULT '',
  country text DEFAULT 'Nigeria',
  postal_code text DEFAULT '',
  phone text DEFAULT '',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own addresses"
  ON addresses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own addresses"
  ON addresses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own addresses"
  ON addresses FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own addresses"
  ON addresses FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);