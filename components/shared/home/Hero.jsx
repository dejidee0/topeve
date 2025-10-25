"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/common/ui/button";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    image:
      "https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=1920",
    title: "Heritage Reimagined",
    subtitle: "2025 Spring Collection",
    cta: "Explore Now",
  },
  {
    image:
      "https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=1920",
    title: "Modern Sophistication",
    subtitle: "Premium African Couture",
    cta: "Shop Collection",
  },
  {
    image:
      "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=1920",
    title: "Timeless Artistry",
    subtitle: "Crafted with Passion",
    cta: "Discover More",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section
      ref={heroRef}
      className="relative h-[85vh] w-full overflow-hidden bg-neutral-900"
      aria-label="Hero Section"
    >
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: currentSlide === index ? 1 : 0,
            scale: currentSlide === index ? 1 : 1.1,
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <motion.div style={{ y }} className="relative w-full h-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover brightness-85"
              sizes="100vw"
              priority={index === 0}
              quality={95}
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60" />
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/woven-light.png')] opacity-10" />
          </motion.div>
        </motion.div>
      ))}

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="container mx-auto px-6 lg:px-10">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-lg md:max-w-xl mx-auto"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white/85 text-xs md:text-sm uppercase tracking-[0.2em] font-medium mb-3 inline-block"
            >
              {slides[currentSlide].subtitle}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-[1.2] tracking-tight relative"
            >
              <span className="relative z-10">
                {slides[currentSlide].title}
              </span>
              <span className="absolute inset-0 text-white/20 translate-x-1 translate-y-1">
                {slides[currentSlide].title}
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-white/90 font-medium uppercase tracking-widest px-6 py-4 text-sm rounded-sm transition-all duration-300 group"
              >
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2"
                >
                  {slides[currentSlide].cta}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black font-medium uppercase tracking-widest px-6 py-4 text-sm rounded-sm transition-all duration-300"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
    </section>
  );
}
