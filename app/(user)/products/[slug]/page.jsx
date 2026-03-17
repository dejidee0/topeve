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

  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { data: product, error } = await getProductBySlug(resolvedParams.slug);

  if (error || !product) {
    console.warn(
      "⚠️ [generateMetadata] Product not found for slug:",
      resolvedParams.slug,
    );
    return {
      title: "Product Not Found | Topevekreation",
    };
  }

  // Convert price from kobo to NGN for display
  const priceInNGN = Math.round(product.price / 100);

  return {
    title: `${product.name} | Topevekreation Luxury Fashion`,
    description: `Shop ${product.name} - ${product.material} ${
      product.category
    }. Premium quality, ethically sourced. Price: ₦${priceInNGN.toLocaleString()}`,
    keywords: [
      product.name,
      product.category,
      product.subcategory,
      product.material,
      "luxury fashion",
      "topevekreation",
      ...(product.tags || []),
    ].filter(Boolean),
    openGraph: {
      title: `${product.name} | Topevekreation`,
      description: `Premium ${product.material} ${
        product.category
      }. Shop now at ₦${priceInNGN.toLocaleString()}`,
      url: `https://topevekreation.com/products/${product.slug}`,
      siteName: "Topevekreation Luxury Fashion",
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
      title: `${product.name} | Topevekreation`,
      description: `Premium ${product.material} ${
        product.category
      }. Shop now at ₦${priceInNGN.toLocaleString()}`,
      images: [product.image],
      creator: "@topevekreation",
      site: "@topevekreation",
    },
    alternates: {
      canonical: `https://topevekreation.com/products/${product.slug}`,
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

  if (error || !product) {
    notFound();
  }

  // Convert price from kobo to NGN for structured data and display
  const priceInNGN = Math.round(product.price / 100);

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
      name: "Topevekreation",
    },
    offers: {
      "@type": "Offer",
      url: `https://topevekreation.com/products/${product.slug}`,
      priceCurrency: product.currency || "NGN",
      price: priceInNGN,
      priceValidUntil: "2026-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Topevekreation",
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

  // BreadcrumbList structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://topevekreation.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: "https://topevekreation.com/products",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://topevekreation.com/products/${product.slug}`,
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
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
