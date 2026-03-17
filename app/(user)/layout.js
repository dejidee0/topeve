// app/layout.jsx
import "../globals.css";
import { Playfair_Display, Montserrat } from "next/font/google";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import CartSidebar from "@/components/shared/cart/sidebar";
import AuthProvider from "@/components/providers/AuthProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-heading",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-body",
});

export const metadata = {
  metadataBase: new URL("https://topevekreation.com"),
  title: {
    default: "Topevekreation — Modern Luxury Fashion Nigeria",
    template: "%s | Topevekreation",
  },
  description:
    "Topevekreation — luxury fashion, bridal collections, beauty and premium accessories handcrafted for the modern Nigerian woman.",
  applicationName: "Topevekreation",
  keywords: [
    "luxury fashion Nigeria",
    "bridal wear Lagos",
    "premium ready-to-wear",
    "Nigerian designer fashion",
    "topevekreation",
  ],
  authors: [{ name: "Topevekreation", url: "https://topevekreation.com" }],
  creator: "Topevekreation",
  publisher: "Topevekreation",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://topevekreation.com",
    siteName: "Topevekreation",
    title: "Topevekreation — Modern Luxury Fashion Nigeria",
    description:
      "Luxury fashion, bridal collections, beauty and premium accessories for the modern Nigerian woman.",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: "Topevekreation — Modern Luxury Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@topevekreation",
    creator: "@topevekreation",
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="bg-cream text-charcoal font-body">
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="md:pt-28 pt-14">{children}</main>
            <Footer />
            <CartSidebar />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
