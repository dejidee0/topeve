"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Critical components loaded immediately for LCP - using NAMED exports with {}

import Hero from "@/components/shared/home/Hero";
import FeaturedBanner from "@/components/shared/home/FeaturedBanner";
import { NewArrivals } from "@/components/shared/home/NewArrivals";
import AnnouncementBar from "@/components/shared/home/AnnouncementBar";

const CategoryGrid = dynamic(
  () => import("@/components/shared/home/CategoryGrid"),
  {
    loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
  }
);

const FeaturesGrid = dynamic(() =>
  import("@/components/shared/home/FeaturesGrid")
);
const Testimonials = dynamic(() =>
  import("@/components/shared/home/Testimonials")
);

const ShopCTA = dynamic(() => import("@/components/shared/home/Newsletter"));

export default function HomePage() {
  return (
    <main className="bg-white overflow-hidden ">
      <AnnouncementBar />
      <Hero />
      <FeaturedBanner />
      <NewArrivals />

      <Suspense fallback={<div className="h-96" />}>
        <CategoryGrid />
      </Suspense>

      <Suspense fallback={null}>
        <FeaturesGrid />
      </Suspense>

      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={null}>
        <ShopCTA />
      </Suspense>
    </main>
  );
}
