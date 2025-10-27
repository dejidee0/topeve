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
    ],
  },
  compress: true,
  // Production source maps
  productionBrowserSourceMaps: false,
  // Optimize fonts
  optimizeFonts: true,

  /* config options here */
};

export default nextConfig;
