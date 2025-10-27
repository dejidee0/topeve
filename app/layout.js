// app/layout.jsx
import "./globals.css";
import { Playfair_Display, Montserrat } from "next/font/google";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

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
        <Navbar />
        <main className="pt-[120px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
