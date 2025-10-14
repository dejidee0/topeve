import "./globals.css";
import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/announcement-bar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "TopeveCreation — Premium African Fashion & Lifestyle",
  description:
    "Curating the finest selection of African fashion, beauty, and lifestyle pieces. Each item tells a story of craftsmanship and cultural heritage.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AnnouncementBar />
        <SiteHeader />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
