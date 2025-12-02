// app/layout.jsx
import "../globals.css";
import { Playfair_Display, Montserrat } from "next/font/google";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import CartSidebar from "@/components/shared/cart/sidebar";
import AuthProvider from "@/components/providers/AuthProvider";

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
  title: "Topeve — Modern Luxury",
  description:
    "Topeve — refined fashion and beauty curated for everyday luxury.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="bg-cream text-charcoal font-body">
        <AuthProvider>
          <Navbar />
          <main className="md:pt-28 pt-14">{children}</main>
          <Footer />
          <CartSidebar />
        </AuthProvider>
      </body>
    </html>
  );
}
