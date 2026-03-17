import { getAllProducts } from "@/utils/products";

const BASE_URL = "https://topevekreation.com";

export default async function sitemap() {
  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.2,
    },
  ];

  // Dynamic product pages
  let productPages = [];
  try {
    const { data: products, error } = await getAllProducts();
    if (!error && products) {
      productPages = products.map((product) => ({
        url: `${BASE_URL}/products/${product.slug}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error("[sitemap] Failed to fetch products:", err);
  }

  return [...staticPages, ...productPages];
}
