"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Twitter, Facebook } from "lucide-react";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All Products" },
      { href: "/collections", label: "Collections" },
      { href: "/categories", label: "Categories" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
    ],
  },
];

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <footer
      className="relative bg-neutral-900 text-white py-12 lg:py-16"
      aria-label="Footer Section"
    >
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/woven-light.png')] opacity-5" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12"
        >
          <motion.div
            variants={itemVariants}
            className="col-span-2 md:col-span-1"
          >
            <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl font-semibold mb-4">
              Brand
            </h3>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xs">
              Discover premium fashion with a blend of heritage and modern
              elegance.
            </p>
            <div className="flex gap-4 mt-6">
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                className="text-neutral-200 hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                className="text-neutral-200 hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                className="text-neutral-200 hover:text-white"
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>

          {footerLinks.map((section) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h3 className="font-['Playfair_Display'] text-lg sm:text-xl font-semibold mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <motion.li
                    key={link.href}
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  >
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-300 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-10 text-center text-xs sm:text-sm text-neutral-400"
        >
          &copy; {new Date().getFullYear()} Brand. All rights reserved.
        </motion.div>
      </div>

      {/* Decorative Line */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-400/50 to-transparent"
      />
    </footer>
  );
}
