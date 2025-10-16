/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "media.voguebusiness.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "images.fastcompany.net" },
      { protocol: "https", hostname: "lookaside.instagram.com" },
      { protocol: "https", hostname: "www.contemporary-african-art.com" },
      { protocol: "https", hostname: "momaa.org" },
      { protocol: "https", hostname: "www.lemon8-app.com" },
      { protocol: "https", hostname: "www.bellanaija.com" },
      { protocol: "https", hostname: "t3.ftcdn.net" },
      { protocol: "https", hostname: "static.vecteezy.com" },
      { protocol: "https", hostname: "media.istockphoto.com" },
      { protocol: "http", hostname: "40.media.tumblr.com" },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
