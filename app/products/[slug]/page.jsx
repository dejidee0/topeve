// app/product/[slug]/page.jsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { products } from "@/lib/mockProducts";
import ProductPageContent from "./content";

// Generate static params for all products (SSG)
export async function generateStaticParams() {
  const params = products.map((product) => ({
    slug: product.slug,
  }));

  console.log("🔧 [generateStaticParams] Generated params:", {
    totalProducts: products.length,
    slugs: params.map((p) => p.slug),
  });

  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  // Await params if it's a promise (Next.js 15+)
  const resolvedParams = await params;

  const product = products.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    console.warn(
      "⚠️ [generateMetadata] Product not found for slug:",
      resolvedParams.slug
    );
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Topeve Luxury Fashion`,
    description: `Shop ${product.name} - ${product.material} ${
      product.category
    }. Premium quality, ethically sourced. Price: ₦${product.price.toLocaleString()}`,
    keywords: [
      product.name,
      product.category,
      product.subcategory,
      product.material,
      "luxury fashion",
      "topeve",
      ...product.tags,
    ].filter(Boolean),
    openGraph: {
      title: `${product.name} | Topeve`,
      description: `Premium ${product.material} ${
        product.category
      }. Shop now at ₦${product.price.toLocaleString()}`,
      url: `https://topeve.com/product/${product.slug}`,
      siteName: "Topeve Luxury Fashion",
      images: [
        {
          url: product.image,
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
      locale: "en_NG",
      type: "website", // Changed from 'product' to 'website'
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Topeve`,
      description: `Premium ${product.material} ${
        product.category
      }. Shop now at ₦${product.price.toLocaleString()}`,
      images: [product.image],
      creator: "@topeve",
      site: "@topeve",
    },
    // Additional metadata
    alternates: {
      canonical: `https://topeve.com/product/${product.slug}`,
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
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;

  const product = products.find((p) => p.slug === resolvedParams.slug);

  console.log("🔍 [ProductPage] Product search result:", {
    searchSlug: resolvedParams.slug,
    found: !!product,
    productId: product?.id,
    productName: product?.name,
  });

  if (!product) {
    console.error("❌ [ProductPage] Product not found, calling notFound()");
    console.log(
      "📋 [ProductPage] Available slugs:",
      products.map((p) => p.slug)
    );
    notFound();
  }

  console.log("✅ [ProductPage] Rendering product:", product.name);

  // Generate JSON-LD structured data for SEO (this is the proper way for product type)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description:
      product.description || `Premium ${product.material} ${product.category}`,
    sku: product.sku || product.id,
    mpn: product.id,
    brand: {
      "@type": "Brand",
      name: "Topeve",
    },
    offers: {
      "@type": "Offer",
      url: `https://topeve.com/product/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      priceValidUntil: "2025-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Topeve",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "127",
    },
    material: product.material,
    color: product.color,
    ...(product.size?.length > 0 && {
      size: product.size.join(", "),
    }),
    category: product.category,
  };

  console.log("📊 [ProductPage] Structured data generated for:", product.name);

  return (
    <>
      {/* Structured Data - This is where we use Product type for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-cream">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand mx-auto mb-4"></div>
              <p className="text-charcoal/70">Loading product...</p>
            </div>
          </div>
        }
      >
        <ProductPageContent product={product} />
      </Suspense>
    </>
  );
}
