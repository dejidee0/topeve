// Product data
export const PRODUCTS = [
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

// Featured collections
export const COLLECTIONS = [
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

// Category tiles
export const CATEGORIES = [
  {
    name: "Dresses",
    href: "/products?category=dresses",
    image:
      "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Bubus & Agbadas",
    href: "/products?category=bubus",
    image:
      "https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Two Piece Sets",
    href: "/products?category=two-piece",
    image:
      "https://images.pexels.com/photos/3394310/pexels-photo-3394310.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Menswear",
    href: "/ready-to-wear/men",
    image:
      "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

// Testimonials
export const TESTIMONIALS = [
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

// Stats
export const STATS = [
  {
    value: "50K+",
    label: "Happy Customers",
  },
  {
    value: "10K+",
    label: "Products Sold",
  },
  {
    value: "15+",
    label: "Years Experience",
  },
  {
    value: "30+",
    label: "Countries Served",
  },
];

// Features
export const FEATURES = [
  {
    title: "Premium Quality",
    description:
      "Handcrafted excellence in every stitch, using only the finest materials",
  },
  {
    title: "Fast Delivery",
    description: "Express shipping available worldwide with real-time tracking",
  },
  {
    title: "Easy Returns",
    description: "30-day hassle-free returns and exchanges on all orders",
  },
  {
    title: "Custom Orders",
    description: "Made-to-measure services available for the perfect fit",
  },
];

// Hero slides
export const HERO_SLIDES = [
  {
    image:
      "https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
    title: "Heritage Redefined",
    subtitle: "2025 Spring Collection",
    cta: "Explore Now",
    href: "/collections/spring-2025",
  },
  {
    image:
      "https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
    title: "Modern Elegance",
    subtitle: "Premium African Fashion",
    cta: "Shop Collection",
    href: "/products",
  },
  {
    image:
      "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
    title: "Timeless Craftsmanship",
    subtitle: "Handcrafted Excellence",
    cta: "Discover More",
    href: "/about",
  },
];

// Instagram posts
export const INSTAGRAM_POSTS = [
  {
    id: 1,
    image:
      "https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 2,
    image:
      "https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 3,
    image:
      "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 4,
    image:
      "https://images.pexels.com/photos/3394310/pexels-photo-3394310.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 5,
    image:
      "https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 6,
    image:
      "https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];
