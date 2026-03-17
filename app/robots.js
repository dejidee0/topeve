export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/my-account/", "/checkout/", "/order-confirmation/"],
      },
    ],
    sitemap: "https://topevekreation.com/sitemap.xml",
    host: "https://topevekreation.com",
  };
}
