"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/common/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-50 bg-neutral-900 text-white shadow-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-['Playfair_Display'] text-2xl sm:text-3xl font-semibold"
        >
          Brand
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <motion.div
              key={link.href}
              variants={linkVariants}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <Link
                href={link.href}
                className="text-sm uppercase tracking-widest font-medium text-neutral-200 hover:text-white transition-colors duration-300"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
          <Button
            asChild
            className="bg-white text-neutral-900 hover:bg-neutral-200 border-2 border-transparent hover:border-neutral-300 font-medium uppercase tracking-widest px-6 py-2 text-sm rounded-sm transition-all duration-300"
          >
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={
          isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="md:hidden overflow-hidden bg-neutral-900"
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <motion.div
              key={link.href}
              variants={linkVariants}
              initial="hidden"
              animate={isOpen ? "visible" : "hidden"}
            >
              <Link
                href={link.href}
                className="block text-sm uppercase tracking-widest font-medium text-neutral-200 hover:text-white transition-colors duration-300 py-2"
                onClick={toggleMenu}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
          <Button
            asChild
            className="bg-white text-neutral-900 hover:bg-neutral-200 border-2 border-transparent hover:border-neutral-300 font-medium uppercase tracking-widest px-6 py-3 text-sm rounded-sm transition-all duration-300"
          >
            <Link href="/products" onClick={toggleMenu}>
              Shop Now
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Decorative Line */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-400/50 to-transparent"
      />
    </motion.nav>
  );
}
