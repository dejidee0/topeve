/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sqpxkhnnjcodymoyorjm.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
    qualities: [75, 85, 90, 95],
  },
  compress: true,
  // Production source maps
  productionBrowserSourceMaps: false,
  // Optimize fonts
  optimizeFonts: true,

  /* config options here */
};

export default nextConfig;
