"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  TrendingUp,
  Sparkles,
  Clock,
  Package,
  Calendar,
} from "lucide-react";

// Mock Products Data
const mockProducts = [
  {
    id: "1",
    name: "Ankara Empress Gown",
    description: "Luxurious floor-length gown with intricate Ankara patterns",
    price: 189.99,
    image:
      "https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "dresses",
    status: "active",
    created_at: new Date().toISOString(),
    brand: { name: "Elegante", logo_url: "" },
    images: [],
  },
  {
    id: "2",
    name: "Aso-Oke Statement Set",
    description: "Traditional Aso-Oke fabric with modern tailoring",
    price: 249.99,
    image:
      "https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "two-piece",
    status: "active",
    created_at: new Date().toISOString(),
    brand: { name: "Heritage", logo_url: "" },
    images: [],
  },
  {
    id: "3",
    name: "Kente Wrap Dress",
    description: "Elegant wrap dress featuring authentic Kente cloth",
    price: 169.99,
    image:
      "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "dresses",
    status: "active",
    created_at: new Date().toISOString(),
    brand: { name: "Royal", logo_url: "" },
    images: [],
  },
  {
    id: "4",
    name: "Dashiki Blazer Set",
    description: "Contemporary blazer with traditional Dashiki prints",
    price: 199.99,
    image:
      "https://images.pexels.com/photos/3394310/pexels-photo-3394310.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "two-piece",
    status: "active",
    created_at: new Date().toISOString(),
    brand: { name: "Modern", logo_url: "" },
    images: [],
  },
  {
    id: "5",
    name: "Adire Maxi Dress",
    description: "Hand-dyed Adire fabric in a flowing silhouette",
    price: 159.99,
    image:
      "https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "dresses",
    status: "active",
    created_at: new Date().toISOString(),
    brand: { name: "Artisan", logo_url: "" },
    images: [],
  },
  {
    id: "6",
    name: "Kaftan Elegance",
    description: "Luxurious silk kaftan with embroidered details",
    price: 229.99,
    image:
      "https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "dresses",
    status: "active",
    created_at: new Date().toISOString(),
    brand: { name: "Luxe", logo_url: "" },
    images: [],
  },
  {
    id: "7",
    name: "Agbada Royal Set",
    description: "Premium Agbada with intricate embroidery",
    price: 299.99,
    image:
      "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "menswear",
    status: "active",
    created_at: new Date().toISOString(),
    brand: { name: "Prestige", logo_url: "" },
    images: [],
  },
  {
    id: "8",
    name: "Ankara Jumpsuit",
    description: "Bold Ankara print in a contemporary jumpsuit design",
    price: 179.99,
    image:
      "https://images.pexels.com/photos/1405963/pexels-photo-1405963.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "jumpsuits",
    status: "active",
    created_at: new Date().toISOString(),
    brand: { name: "Urban", logo_url: "" },
    images: [],
  },
];

// Mock Blog Posts
const mockBlogPosts = [
  {
    id: "1",
    title: "The Evolution of Ankara Fashion in Contemporary Design",
    slug: "evolution-ankara-fashion",
    excerpt:
      "Discover how traditional Ankara fabric has transformed modern fashion, blending heritage with innovation to create stunning contemporary pieces.",
    hero_url:
      "https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=1200",
    published_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "2",
    title: "Styling Guide: Traditional Meets Modern",
    slug: "styling-guide-traditional-modern",
    excerpt:
      "Learn expert tips on how to style traditional African garments for both formal events and everyday wear with confidence and elegance.",
    hero_url:
      "https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=1200",
    published_at: "2025-01-10T00:00:00Z",
  },
  {
    id: "3",
    title: "Behind the Seams: Craftsmanship of Aso-Oke",
    slug: "craftsmanship-aso-oke",
    excerpt:
      "An intimate look at the intricate process of creating Aso-Oke fabric, from traditional looms to the finished masterpiece.",
    hero_url:
      "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=1200",
    published_at: "2025-01-05T00:00:00Z",
  },
];

const categoryTiles = [
  {
    name: "Dresses",
    href: "/shop?category=dresses",
    image:
      "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Bubus & Agbadas",
    href: "/shop?category=bubus",
    image:
      "https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Two Piece Sets",
    href: "/shop?category=two-piece",
    image:
      "https://images.pexels.com/photos/3394310/pexels-photo-3394310.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Tops & Blouses",
    href: "/shop?category=tops",
    image:
      "https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Bottoms",
    href: "/shop?category=bottoms",
    image:
      "https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Jumpsuits",
    href: "/shop?category=jumpsuits",
    image:
      "https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Accessories",
    href: "/accessories",
    image:
      "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Menswear",
    href: "/ready-to-wear/men",
    image:
      "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// Animated Hero Section Component
function AnimatedHero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative h-[70vh] lg:h-[85vh] overflow-hidden"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 grid grid-cols-2 lg:grid-cols-4 gap-1"
      >
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative col-span-1"
        >
          <Image
            src="https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="African fashion editorial"
            fill
            className="object-cover"
            sizes="25vw"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative col-span-1 lg:col-span-2"
        >
          <Image
            src="https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="African fashion editorial"
            fill
            className="object-cover"
            sizes="50vw"
            priority
          />
          <motion.div
            style={{ opacity }}
            className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 flex flex-col items-center justify-center text-white px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "60px" }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="h-0.5 bg-white mx-auto mb-6"
              />
              <h1 className="font-['Playfair_Display'] text-4xl lg:text-7xl font-bold tracking-tight text-center mb-4">
                Elegance Redefined
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-base lg:text-xl mb-8 text-center max-w-md mx-auto"
              >
                Discover our curated collection of premium African fashion
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 font-medium uppercase tracking-wider px-8"
                >
                  <Link href="/shop">Shop Now</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative col-span-2 lg:col-span-1"
        >
          <Image
            src="https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="African fashion editorial"
            fill
            className="object-cover"
            sizes="25vw"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Animated Product Card
function AnimatedProductCard({
  product,
  index,
}: {
  product: any;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/products/${product.id}`} className="group block">
        <motion.div
          className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <motion.div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent"
          >
            <Button className="w-full bg-white text-black hover:bg-gray-100 font-medium uppercase text-sm tracking-wider">
              Quick View
            </Button>
          </motion.div>
        </motion.div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            {product.brand.name}
          </p>
          <h3 className="font-medium group-hover:underline transition-all">
            {product.name}
          </h3>
          <p className="font-['Playfair_Display'] text-lg font-semibold">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

// Animated Section Header
function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-center mb-12"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: "60px" } : { width: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="h-0.5 bg-black mx-auto mb-4"
      />
      <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-bold tracking-tight mb-2">
        {title}
      </h2>
      {subtitle && <p className="text-gray-600 text-lg mt-2">{subtitle}</p>}
    </motion.div>
  );
}

// Animated Category Card
function AnimatedCategoryCard({
  category,
  index,
}: {
  category: any;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={category.href}
        className="group relative aspect-square overflow-hidden block rounded-lg"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full h-full"
        >
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
          whileHover={{ opacity: 0.9 }}
        />
        <motion.div
          className="absolute inset-0 flex items-end p-6"
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h3 className="font-['Playfair_Display'] text-white text-2xl lg:text-3xl tracking-tight font-bold mb-2">
              {category.name}
            </h3>
            <motion.div
              className="flex items-center gap-2 text-white/90 text-sm uppercase tracking-wider"
              initial={{ x: -10, opacity: 0 }}
              whileHover={{ x: 0, opacity: 1 }}
            >
              <span>Explore</span>
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Animated Blog Card
function AnimatedBlogCard({ post, index }: { post: any; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        <motion.div
          className="relative aspect-[4/3] mb-4 overflow-hidden rounded-lg bg-gray-100"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={post.hero_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs text-gray-500 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(post.published_at)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {getReadingTime(post.excerpt)} min read
            </span>
          </div>
          <h3 className="font-['Playfair_Display'] text-xl lg:text-2xl font-bold group-hover:underline transition-all leading-tight">
            {post.title}
          </h3>
          <p className="text-gray-600 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
          <motion.span
            className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider group-hover:gap-3 transition-all"
            whileHover={{ x: 5 }}
          >
            Read Article
            <ChevronRight className="h-4 w-4" />
          </motion.span>
        </div>
      </Link>
    </motion.div>
  );
}

// Feature Banner
function FeatureBanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-black text-white py-16 lg:py-24"
    >
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center"
          >
            <TrendingUp className="h-12 w-12 mx-auto mb-4" />
            <h3 className="font-['Playfair_Display'] text-2xl font-bold mb-2">
              Premium Quality
            </h3>
            <p className="text-white/70">
              Hand-selected fabrics and meticulous craftsmanship in every piece
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center"
          >
            <Sparkles className="h-12 w-12 mx-auto mb-4" />
            <h3 className="font-['Playfair_Display'] text-2xl font-bold mb-2">
              Unique Designs
            </h3>
            <p className="text-white/70">
              Exclusive collections that celebrate African heritage and modern
              style
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center"
          >
            <Package className="h-12 w-12 mx-auto mb-4" />
            <h3 className="font-['Playfair_Display'] text-2xl font-bold mb-2">
              Worldwide Shipping
            </h3>
            <p className="text-white/70">
              Fast and secure delivery to your doorstep, anywhere in the world
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

// Main Homepage Component
export default function HomePage() {
  return (
    <div className="bg-white">
      <AnimatedHero />

      {/* New Arrivals Section */}
      <section className="container py-16 lg:py-24">
        <SectionHeader
          title="New Arrivals"
          subtitle="Discover the latest additions to our collection"
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {mockProducts.map((product, index) => (
            <AnimatedProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="uppercase tracking-wider border-black hover:bg-black hover:text-white transition-all font-medium"
          >
            <Link href="/shop">View All Products</Link>
          </Button>
        </motion.div>
      </section>

      {/* Feature Banner */}
      <FeatureBanner />

      {/* Explore Your Style Section */}
      <section className="container py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[3/4] overflow-hidden rounded-lg"
          >
            <Image
              src="https://images.pexels.com/photos/1405963/pexels-photo-1405963.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Explore your style"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "60px" }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="h-0.5 bg-black"
            />
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
              Explore Your Style
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              From traditional ceremonies to contemporary gatherings, our
              collection celebrates the richness of African heritage with modern
              sophistication. Each piece is carefully selected to ensure you
              make a statement wherever you go.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="bg-black text-white hover:bg-gray-800 uppercase tracking-wider font-medium px-8"
              >
                <Link href="/shop">Shop Collection</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Shop By Category Section */}
      <section className="container py-16 lg:py-24">
        <SectionHeader
          title="Shop By Category"
          subtitle="Find your perfect style"
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {categoryTiles.map((category, index) => (
            <AnimatedCategoryCard
              key={category.name}
              category={category}
              index={index}
            />
          ))}
        </motion.div>
      </section>

      {/* Blog Section */}
      <section className="container py-16 lg:py-24 bg-gray-50">
        <SectionHeader
          title="From The Journal"
          subtitle="Stories, inspiration, and style guides"
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
        >
          {mockBlogPosts.map((post, index) => (
            <AnimatedBlogCard key={post.id} post={post} index={index} />
          ))}
        </motion.div>
      </section>

      {/* Newsletter CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-black text-white py-16 lg:py-24"
      >
        <div className="container max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="font-['Playfair_Display'] text-3xl lg:text-5xl font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Subscribe to our newsletter for exclusive offers, new arrivals,
              and style inspiration
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button className="bg-white text-black hover:bg-gray-100 px-8 font-medium uppercase tracking-wider">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
