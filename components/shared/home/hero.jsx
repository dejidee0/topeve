"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Package,
  Star,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { HERO_SLIDES, HERO_CAMPAIGN } from "@/lib/constants";

const AUTOPLAY_DURATION = 6000;

const slideVariants = {
  enter: (direction) => ({
    opacity: 0,
    scale: 1.05,
    x: direction > 0 ? 20 : -20,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.32, 0.72, 0, 1],
    },
  },
  exit: (direction) => ({
    opacity: 0,
    scale: 0.95,
    x: direction < 0 ? 20 : -20,
    transition: {
      duration: 0.6,
      ease: [0.32, 0.72, 0, 1],
    },
  }),
};

const textVariants = {
  enter: { opacity: 0, y: 20 },
  center: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
};

export default function Hero() {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const autoplayTimeoutRef = useRef(null);

  // Parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 100 });
  const imgX = useTransform(smoothMouseX, [-300, 300], [-12, 12]);
  const imgY = useTransform(smoothMouseY, [-200, 200], [-8, 8]);

  const slideCount = HERO_SLIDES.length;
  const currentSlide = HERO_SLIDES[currentIndex];

  // Navigation functions
  const goToSlide = useCallback(
    (newIndex, newDirection = 1) => {
      let targetIndex = newIndex;
      if (targetIndex < 0) targetIndex = slideCount - 1;
      if (targetIndex >= slideCount) targetIndex = 0;
      setCurrentIndex([targetIndex, newDirection]);
    },
    [slideCount]
  );

  const goNext = useCallback(() => {
    goToSlide(currentIndex + 1, 1);
  }, [currentIndex, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(currentIndex - 1, -1);
  }, [currentIndex, goToSlide]);

  // Autoplay effect
  useEffect(() => {
    if (isPaused) {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
      return;
    }

    autoplayTimeoutRef.current = setTimeout(() => {
      goNext();
    }, AUTOPLAY_DURATION);

    return () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
    };
  }, [currentIndex, isPaused, goNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  // Parallax mouse movement (desktop only)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isTouch) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [mouseX, mouseY]);

  // Touch swipe gestures
  const touchStart = useRef(null);
  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart.current - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    touchStart.current = null;
  };

  const benefits = [
    {
      icon: Package,
      title: "Free Shipping",
      description: "Orders ₦50,000+",
    },
    {
      icon: Star,
      title: "Premium Quality",
      description: "Carefully curated",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day policy",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-cream overflow-hidden max-h-[75vh]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Hero carousel"
    >
      {/* Campaign Banner */}
      {HERO_CAMPAIGN?.active && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-40"
        >
          <Link
            href={HERO_CAMPAIGN.href}
            className="group inline-flex items-center gap-2 px-4 md:px-5 py-1.5 md:py-2 text-[10px] md:text-xs font-bold tracking-wider rounded-full bg-brand text-cream shadow-lg hover:bg-gold hover:text-brand transition-all duration-300 hover:scale-105"
          >
            <Sparkles size={12} className="animate-pulse" />
            {HERO_CAMPAIGN.label}
            <ArrowRight
              size={12}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-8 md:pb-12 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center w-full">
          {/* Left: Text Content - Takes 5 columns on desktop */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`text-${currentSlide.id}`}
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="order-2 lg:order-1 lg:col-span-5 space-y-4 md:space-y-6"
            >
              {/* Badge */}
              {currentSlide.badge && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block"
                >
                  <span className="px-3 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-semibold tracking-wide uppercase bg-gold/20 text-brand rounded-full">
                    {currentSlide.badge}
                  </span>
                </motion.div>
              )}

              {/* Title */}
              <motion.h1
                variants={textVariants}
                className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[1.1] text-brand tracking-tight"
              >
                {currentSlide.title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={textVariants}
                className="text-base sm:text-lg lg:text-xl text-charcoal/85 leading-relaxed"
              >
                {currentSlide.subtitle}
              </motion.p>

              {/* Description - hidden on mobile */}
              <motion.p
                variants={textVariants}
                className="hidden md:block text-sm lg:text-base text-charcoal/70"
              >
                {currentSlide.description}
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={textVariants}
                className="flex flex-wrap gap-3 md:gap-4 items-center pt-2"
              >
                <Link
                  href={currentSlide.href}
                  className="group inline-flex items-center gap-2 bg-brand text-cream px-6 md:px-8 py-3 md:py-4 rounded-full text-sm md:text-base font-semibold shadow-lg hover:bg-gold hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => setIsPaused(true)}
                >
                  {currentSlide.cta}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <button
                  onClick={goNext}
                  className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-brand border-2 border-brand/20 px-5 md:px-6 py-2.5 md:py-3 rounded-full hover:bg-brand hover:border-brand hover:text-cream transition-all duration-300"
                  aria-label="View next collection"
                >
                  View Next
                  <ChevronRight size={14} />
                </button>
              </motion.div>

              {/* Benefits - Compact on mobile */}
              <motion.div
                variants={textVariants}
                className="grid grid-cols-3 gap-3 md:gap-6 pt-2 md:pt-4"
              >
                {benefits.map((benefit, idx) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 md:w-11 md:h-11 rounded-full bg-gold/15 flex items-center justify-center">
                      <benefit.icon
                        size={16}
                        className="text-gold md:w-5 md:h-5"
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <div className="text-[10px] md:text-sm font-semibold text-brand">
                        {benefit.title}
                      </div>
                      <div className="text-[9px] md:text-xs text-charcoal/70 mt-0.5 hidden md:block">
                        {benefit.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Right: Image - Takes 7 columns on desktop */}
          <div className="order-1 lg:order-2 lg:col-span-7 relative">
            <div className="relative w-full h-[50vh] sm:h-[55vh] lg:h-[65vh] max-h-[65vh] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`image-${currentSlide.id}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                >
                  <motion.div
                    style={{ x: imgX, y: imgY }}
                    className="relative w-full h-full will-change-transform"
                  >
                    <Image
                      src={currentSlide.img}
                      alt={currentSlide.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 900px"
                      priority={currentIndex === 0}
                      className="object-cover"
                      quality={90}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls (Desktop) */}
              <div className="hidden lg:flex absolute inset-x-0 top-1/2 -translate-y-1/2 justify-between px-4 pointer-events-none">
                <button
                  onClick={goPrev}
                  aria-label="Previous slide"
                  className="pointer-events-auto group w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm text-brand shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 flex items-center justify-center"
                >
                  <ChevronLeft
                    size={20}
                    className="group-hover:-translate-x-0.5 transition-transform"
                  />
                </button>

                <button
                  onClick={goNext}
                  aria-label="Next slide"
                  className="pointer-events-auto group w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm text-brand shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 flex items-center justify-center"
                >
                  <ChevronRight
                    size={20}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </button>
              </div>

              {/* Slide Indicators with CSS Animation Progress */}
              <div className="absolute bottom-4 md:bottom-6 left-0 right-0 px-4 md:px-6">
                <div className="flex items-center justify-center gap-2 md:gap-3">
                  {HERO_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      onClick={() =>
                        goToSlide(idx, idx > currentIndex ? 1 : -1)
                      }
                      aria-label={`Go to slide ${idx + 1}`}
                      className="relative group"
                    >
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          idx === currentIndex
                            ? "bg-white scale-125"
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                      />
                      {idx === currentIndex && !isPaused && (
                        <svg
                          className="absolute inset-0 -m-1 w-4 h-4"
                          viewBox="0 0 16 16"
                        >
                          <circle
                            cx="8"
                            cy="8"
                            r="7"
                            fill="none"
                            stroke="rgba(255,255,255,0.5)"
                            strokeWidth="1"
                            strokeDasharray="44"
                            strokeDashoffset="0"
                            className="animate-progress-ring"
                            style={{
                              animation: `progress-ring ${AUTOPLAY_DURATION}ms linear`,
                            }}
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Slide Counter (Mobile) */}
            <div className="lg:hidden mt-3 text-center">
              <span className="text-xs md:text-sm text-charcoal/60">
                {currentIndex + 1} / {slideCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation for progress ring */}
      <style jsx>{`
        @keyframes progress-ring {
          from {
            stroke-dashoffset: 44;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </section>
  );
}
