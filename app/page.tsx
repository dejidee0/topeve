"use client";

import { useEffect, useRef, useState } from "react";
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
  Star,
  ArrowRight,
  Play,
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
    badge: "New",
  },
  {
    id: "2",
    name: "Aso-Oke Statement Set",
    description: "Traditional Aso-Oke fabric with modern tailoring",
    price: 249.99,
    image:
      "https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "two-piece",
    badge: "Trending",
  },
  {
    id: "3",
    name: "Kente Wrap Dress",
    description: "Elegant wrap dress featuring authentic Kente cloth",
    price: 169.99,
    image:
      "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "dresses",
  },
  {
    id: "4",
    name: "Dashiki Blazer Set",
    description: "Contemporary blazer with traditional Dashiki prints",
    price: 199.99,
    image:
      "https://images.pexels.com/photos/3394310/pexels-photo-3394310.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "two-piece",
  },
  {
    id: "5",
    name: "Adire Maxi Dress",
    description: "Hand-dyed Adire fabric in a flowing silhouette",
    price: 159.99,
    image:
      "https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "dresses",
  },
  {
    id: "6",
    name: "Kaftan Elegance",
    description: "Luxurious silk kaftan with embroidered details",
    price: 229.99,
    image:
      "https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "dresses",
    badge: "Limited",
  },
  {
    id: "7",
    name: "Agbada Royal Set",
    description: "Premium Agbada with intricate embroidery",
    price: 299.99,
    image:
      "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "menswear",
  },
  {
    id: "8",
    name: "Ankara Jumpsuit",
    description: "Bold Ankara print in a contemporary jumpsuit design",
    price: 179.99,
    image:
      "https://images.pexels.com/photos/1405963/pexels-photo-1405963.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "jumpsuits",
  },
];

const featuredCollections = [
  {
    title: "Heritage Collection",
    description: "Traditional craftsmanship meets contemporary design",
    image:
      "https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=1200",
    href: "/collections/heritage",
  },
  {
    title: "Modern Essentials",
    description: "Everyday elegance for the modern wardrobe",
    image:
      "https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=1200",
    href: "/collections/modern",
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
    name: "Menswear",
    href: "/ready-to-wear/men",
    image:
      "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

const testimonials = [
  {
    name: "Adaeze Okonkwo",
    role: "Fashion Enthusiast",
    content:
      "The quality and attention to detail in every piece is extraordinary. I've never felt more confident and elegant.",
    rating: 5,
    image:
      "https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=300",
  },
  {
    name: "Chioma Nwankwo",
    role: "Event Planner",
    content:
      "Perfect for every occasion. The designs beautifully blend tradition with modern sophistication.",
    rating: 5,
    image:
      "https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=300",
  },
  {
    name: "Zainab Ibrahim",
    role: "Style Influencer",
    content:
      "My go-to destination for authentic African fashion. The craftsmanship is unmatched.",
    rating: 5,
    image:
      "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=300",
  },
];

// Nike-Inspired Hero with Full-Width Image and Overlay Text
function NikeHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const slides = [
    {
      image: "/hero/1.jpg",
      title: "Heritage Redefined",
      subtitle: "2025 Spring Collection",
      cta: "Explore Now",
    },
    {
      image: "/hero/2.jpg",
      title: "Modern Elegance",
      subtitle: "Premium African Fashion",
      cta: "Shop Collection",
    },
    {
      image: "/hero/3.jpg",
      title: "Timeless Craftsmanship",
      subtitle: "Handcrafted Excellence",
      cta: "Discover More",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: currentSlide === index ? 1 : 0,
            scale: currentSlide === index ? 1 : 1.1,
          }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div style={{ y }} className="relative w-full h-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority={index === 0}
              quality={90}
            />
          </motion.div>
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

      <div className="absolute inset-0 flex items-center">
        <div className="container">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-white text-sm md:text-base uppercase tracking-[0.3em] mb-4 font-medium"
            >
              {slides[currentSlide].subtitle}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="font-['Playfair_Display'] text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[0.95] tracking-tight"
            >
              {slides[currentSlide].title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-white/90 font-medium uppercase tracking-wider px-8 h-12 rounded-full"
              >
                <Link href="/shop">{slides[currentSlide].cta}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black font-medium uppercase tracking-wider px-8 h-12 rounded-full"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 transition-all duration-300 ${
              currentSlide === index ? "w-12 bg-white" : "w-8 bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 right-12 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2 text-white"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-[1px] h-12 bg-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Announcement Bar
function AnnouncementBar() {
  const announcements = [
    "Free shipping on orders over $200",
    "New Spring Collection Now Available",
    "Shop Now, Pay Later with Afterpay",
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black text-white py-3 overflow-hidden">
      <motion.div
        key={current}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center text-sm uppercase tracking-wider"
      >
        {announcements[current]}
      </motion.div>
    </div>
  );
}

// Featured Product Banner
function FeaturedBanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="container py-20 lg:py-32">
      <Link href="/products/featured" className="block group">
        <div className="grid lg:grid-cols-2 gap-0 bg-gray-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-square lg:aspect-auto"
          >
            <Image
              src="https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Featured Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="50vw"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="flex flex-col justify-center p-12 lg:p-20"
          >
            <span className="text-sm uppercase tracking-[0.3em] mb-4 font-medium">
              Featured Collection
            </span>
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              The Empress Line
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              A celebration of African royalty. Handcrafted with premium fabrics
              and adorned with intricate embroidery, each piece tells a story of
              heritage and elegance.
            </p>
            <div className="flex items-center gap-3 text-black group-hover:gap-5 transition-all">
              <span className="font-medium uppercase tracking-wider">
                Shop Collection
              </span>
              <ArrowRight className="h-5 w-5" />
            </div>
          </motion.div>
        </div>
      </Link>
    </section>
  );
}

// Product Card Component
function ProductCard({ product, index }: { product: any; index: number }) {
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
        <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100">
          {product.badge && (
            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs uppercase tracking-wider z-10">
              {product.badge}
            </div>
          )}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 p-4"
          >
            <Button className="w-full bg-white text-black hover:bg-gray-100 font-medium uppercase text-sm tracking-wider rounded-full">
              Quick Add
            </Button>
          </motion.div>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium group-hover:underline transition-all">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-1">
            {product.description}
          </p>
          <p className="font-['Playfair_Display'] text-lg font-semibold">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

// Collection Showcase
function CollectionShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 lg:py-32 bg-gray-50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm uppercase tracking-[0.3em] mb-4 inline-block font-medium">
            Curated Collections
          </span>
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-6xl font-bold">
            Signature Styles
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {featuredCollections.map((collection, index) => (
            <motion.div
              key={collection.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href={collection.href} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden mb-6">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="font-['Playfair_Display'] text-3xl lg:text-4xl font-bold text-white mb-2">
                      {collection.title}
                    </h3>
                    <p className="text-white/90 mb-4">
                      {collection.description}
                    </p>
                    <div className="flex items-center gap-2 text-white group-hover:gap-4 transition-all">
                      <span className="text-sm uppercase tracking-wider font-medium">
                        Explore
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Video Section
function VideoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="container py-20 lg:py-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
        }
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-video overflow-hidden rounded-lg group cursor-pointer"
      >
        <Image
          src="https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Brand Story"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center"
          >
            <Play className="h-8 w-8 text-black ml-1" fill="currentColor" />
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
          <h3 className="font-['Playfair_Display'] text-3xl lg:text-5xl font-bold text-white mb-2">
            Our Story
          </h3>
          <p className="text-white/90 text-lg max-w-2xl">
            Discover the craftsmanship and passion behind every piece
          </p>
        </div>
      </motion.div>
    </section>
  );
}

// Category Grid
function CategoryGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="container py-20 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="text-sm uppercase tracking-[0.3em] mb-4 inline-block font-medium">
          Shop by Category
        </span>
        <h2 className="font-['Playfair_Display'] text-4xl lg:text-6xl font-bold">
          Find Your Style
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {categoryTiles.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href={category.href}
              className="group block relative aspect-square overflow-hidden"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <h3 className="font-['Playfair_Display'] text-2xl lg:text-3xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-2 text-white/90 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm uppercase tracking-wider">
                      Shop Now
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// Testimonials Section
function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="bg-black text-white py-20 lg:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm uppercase tracking-[0.3em] mb-4 inline-block font-medium text-white/80">
            Testimonials
          </span>
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-6xl font-bold">
            What Our Clients Say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="bg-white/5 p-8 backdrop-blur-sm"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-white text-white" />
                ))}
              </div>
              <p className="text-white/90 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-white/60">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Instagram Feed
function InstagramFeed() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const images = [
    "https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/3394310/pexels-photo-3394310.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg?auto=compress&cs=tinysrgb&w=600",
  ];

  return (
    <section ref={ref} className="py-20 lg:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm uppercase tracking-[0.3em] mb-4 inline-block font-medium">
            @yourbrandname
          </span>
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-6xl font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-gray-600 text-lg">
            Share your style and tag us for a chance to be featured
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
              }
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative aspect-square overflow-hidden group cursor-pointer"
            >
              <Image
                src={image}
                alt={`Instagram post ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 16vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-black hover:bg-black hover:text-white font-medium uppercase tracking-wider px-8 rounded-full"
          >
            <Link href="https://instagram.com" target="_blank">
              Follow Us on Instagram
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "100+", label: "Unique Designs" },
    { value: "25+", label: "Countries Shipped" },
    { value: "4.9", label: "Average Rating" },
  ];

  return (
    <section ref={ref} className="bg-gray-50 py-20">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center"
            >
              <h3 className="font-['Playfair_Display'] text-5xl lg:text-6xl font-bold mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-600 uppercase tracking-wider text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Features Grid
function FeaturesGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const features = [
    {
      icon: TrendingUp,
      title: "Premium Quality",
      description:
        "Hand-selected fabrics and meticulous craftsmanship in every piece",
    },
    {
      icon: Sparkles,
      title: "Unique Designs",
      description:
        "Exclusive collections that celebrate African heritage and modern style",
    },
    {
      icon: Package,
      title: "Worldwide Shipping",
      description:
        "Fast and secure delivery to your doorstep, anywhere in the world",
    },
    {
      icon: Clock,
      title: "Easy Returns",
      description:
        "30-day hassle-free returns on all orders for your peace of mind",
    },
  ];

  return (
    <section ref={ref} className="container py-20 lg:py-32">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-center"
          >
            <feature.icon
              className="h-12 w-12 mx-auto mb-6"
              strokeWidth={1.5}
            />
            <h3 className="font-['Playfair_Display'] text-2xl font-bold mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// Newsletter Section
function Newsletter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="bg-black text-white py-20 lg:py-32">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-sm uppercase tracking-[0.3em] mb-4 inline-block font-medium text-white/80">
            Newsletter
          </span>
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-6xl font-bold mb-6">
            Stay Connected
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            Subscribe to receive exclusive offers, new arrivals, and style
            inspiration delivered straight to your inbox
          </p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-colors"
              required
            />
            <Button className="bg-white text-black hover:bg-white/90 px-8 py-4 font-medium uppercase tracking-wider">
              Subscribe
            </Button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-white/50 text-sm mt-6"
          >
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// Brand Story Section
function BrandStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="container py-20 lg:py-32">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-sm uppercase tracking-[0.3em] mb-4 inline-block font-medium">
            Our Heritage
          </span>
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Where Tradition Meets Innovation
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            We believe in preserving the rich tapestry of African fashion while
            embracing contemporary design. Each piece in our collection is a
            testament to the skilled artisans who pour their heart and soul into
            creating wearable art.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            From the vibrant streets of Lagos to fashion capitals around the
            world, we're redefining what it means to wear African fashion with
            pride and sophistication.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-black text-white hover:bg-gray-800 uppercase tracking-wider font-medium px-8 rounded-full"
          >
            <Link href="/about">Discover Our Story</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Brand story"
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Brand story"
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>
          </div>
          <div className="space-y-4 pt-12">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Brand story"
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Brand story"
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Main Homepage Component
export default function HomePage() {
  return (
    <main className="bg-white">
      <AnnouncementBar />
      <NikeHero />
      <FeaturedBanner />

      {/* New Arrivals Section */}
      <section className="container py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm uppercase tracking-[0.3em] mb-4 inline-block font-medium">
            Latest Drops
          </span>
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-6xl font-bold mb-4">
            New Arrivals
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover the latest additions to our collection
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {mockProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-black hover:bg-black hover:text-white font-medium uppercase tracking-wider px-12 rounded-full"
          >
            <Link href="/shop">View All Products</Link>
          </Button>
        </motion.div>
      </section>

      <CollectionShowcase />
      <VideoSection />
      <CategoryGrid />
      <StatsSection />
      <BrandStory />
      <FeaturesGrid />
      <Testimonials />
      <InstagramFeed />
      <Newsletter />
    </main>
  );
}
