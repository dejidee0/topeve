// app/products/[slug]/page.jsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug } from "@/utils/products";
import ProductPageContent from "./content";

export const revalidate = 3600; // Revalidate every hour

// Generate static params for all products (SSG)
export async function generateStaticParams() {
  const { data: products, error } = await getAllProducts();

  if (error || !products) {
    console.error("❌ [generateStaticParams] Error fetching products:", error);
    return [];
  }

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
  const resolvedParams = await params;
  const { data: product, error } = await getProductBySlug(resolvedParams.slug);

  if (error || !product) {
    console.warn(
      "⚠️ [generateMetadata] Product not found for slug:",
      resolvedParams.slug
    );
    return {
      title: "Product Not Found | Topeve",
    };
  }

  // Convert price from kobo to NGN for display
  const priceInNGN = product.price;

  return {
    title: `${product.name} | Topeve Luxury Fashion`,
    description: `Shop ${product.name} - ${product.material} ${
      product.category
    }. Premium quality, ethically sourced. Price: ₦${priceInNGN.toLocaleString()}`,
    keywords: [
      product.name,
      product.category,
      product.subcategory,
      product.material,
      "luxury fashion",
      "topeve",
      ...(product.tags || []),
    ].filter(Boolean),
    openGraph: {
      title: `${product.name} | Topeve`,
      description: `Premium ${product.material} ${
        product.category
      }. Shop now at ₦${priceInNGN.toLocaleString()}`,
      url: `https://topeve.com/products/${product.slug}`,
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
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Topeve`,
      description: `Premium ${product.material} ${
        product.category
      }. Shop now at ₦${priceInNGN.toLocaleString()}`,
      images: [product.image],
      creator: "@topeve",
      site: "@topeve",
    },
    alternates: {
      canonical: `https://topeve.com/products/${product.slug}`,
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
  const { data: product, error } = await getProductBySlug(resolvedParams.slug);

  console.log("🔍 [ProductPage] Product search result:", {
    searchSlug: resolvedParams.slug,
    found: !!product,
    productId: product?.id,
    productName: product?.name,
  });

  if (error || !product) {
    console.error("❌ [ProductPage] Product not found:", error);
    notFound();
  }

  console.log("✅ [ProductPage] Rendering product:", product.name);

  // Convert price from kobo to NGN for structured data
  const priceInNGN = product.price;

  // Generate JSON-LD structured data for SEO
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
      url: `https://topeve.com/products/${product.slug}`,
      priceCurrency: product.currency || "NGN",
      price: priceInNGN,
      priceValidUntil: "2025-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: product.in_stock
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
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-cream pt-24">
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
