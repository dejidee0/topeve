import { Suspense } from "react";
import Hero from "@/components/shared/home/hero";
import BentoGrid from "@/components/shared/home/bento";
import BridalShower from "@/components/shared/home/bridal";
import Featured from "@/components/shared/home/featured";
import Brand from "@/components/shared/home/brand";
import Testimonials from "@/components/shared/home/testimonials";
import CTA from "@/components/shared/home/cta";
import { getFeaturedProducts } from "@/utils/products";

export const revalidate = 3600; // Revalidate every hour

// Metadata
export const metadata = {
  title: "Topeve - Luxury Fashion & Premium Ready-to-Wear | Nigeria",
  description:
    "Discover Topeve's exclusive collection of luxury fashion, bridal wear, beauty products, and premium accessories. Shop handcrafted pieces designed for the modern Nigerian woman. Free shipping on orders over ₦50,000.",
  keywords: [
    "luxury fashion Nigeria",
    "bridal shower collection",
    "premium ready-to-wear",
    "Nigerian fashion",
    "luxury accessories",
    "designer clothing Lagos",
    "bridal collection Nigeria",
    "premium beauty products",
    "high-end fashion",
    "topeve fashion",
  ],
  openGraph: {
    title: "Topeve - Luxury Fashion & Premium Ready-to-Wear",
    description:
      "Shop exclusive luxury fashion, bridal collections, and premium accessories. Handcrafted pieces for the discerning Nigerian shopper.",
    url: "https://topeve.com",
    siteName: "Topeve",
    images: [
      {
        url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Topeve Luxury Fashion",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  alternates: {
    canonical: "https://topeve.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Topeve",
  url: "https://topeve.com",
  description:
    "Luxury fashion e-commerce platform featuring premium ready-to-wear, bridal collections, beauty products, and accessories in Nigeria.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://topeve.com/products?search={search_term_string}",
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "Topeve",
    logo: {
      "@type": "ImageObject",
      url: "https://topeve.com/logo.png",
    },
  },
};

// Loading fallback component
function SectionSkeleton() {
  return (
    <div className="w-full px-6 lg:px-16 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="h-8 w-64 bg-taupe/20 rounded-lg mx-auto mb-4 animate-pulse" />
        <div className="h-4 w-48 bg-taupe/20 rounded mx-auto mb-12 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-cream/50 rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/5] bg-taupe/20" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-taupe/20 rounded w-3/4" />
                <div className="h-6 bg-taupe/20 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  // Fetch featured products server-side
  const { data: featuredProducts, error } = await getFeaturedProducts({
    limit: 8,
  });

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen">
        {/* Hero - Load immediately (above fold) */}
        <Hero />

        {/* Bento Grid - Load immediately */}
        <BentoGrid />

        {/* Bridal Shower - Lazy load */}
        <Suspense fallback={<SectionSkeleton />}>
          <BridalShower />
        </Suspense>

        {/* Featured Products - Pass server data */}
        <Suspense fallback={<SectionSkeleton />}>
          <Featured products={featuredProducts || []} />
        </Suspense>

        {/* Brand Story - Lazy load */}
        <Suspense fallback={<SectionSkeleton />}>
          <Brand />
        </Suspense>

        {/* Testimonials - Lazy load */}
        <Suspense fallback={<SectionSkeleton />}>
          <Testimonials />
        </Suspense>

        {/* CTA - Lazy load */}
        <Suspense fallback={<SectionSkeleton />}>
          <CTA />
        </Suspense>
      </main>
    </>
  );
}
