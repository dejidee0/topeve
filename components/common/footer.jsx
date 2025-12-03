"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const footerLinks = {
    shop: ["Women", "Men", "Kids", "Accessories", "Beauty"],
    company: ["About Us", "Careers", "Press", "Sustainability"],
    support: ["Contact", "Shipping", "Returns", "FAQs", "Privacy Policy"],
  };

  return (
    <footer className="bg-cream border-t border-taupe/70 text-charcoal pt-16 pb-8 px-6 md:px-10 lg:px-20">
      {/* Top Grid */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h2 className="font-heading text-2xl tracking-tight text-brand">
            Topeve
          </h2>
          <p className="text-sm text-charcoal/70 leading-relaxed max-w-xs">
            Where timeless style meets contemporary elegance. Curating fashion
            that inspires confidence and individuality.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <Link
              href="https://instagram.com"
              target="_blank"
              className="hover:text-gold transition-colors"
            >
              <Instagram size={18} />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              className="hover:text-gold transition-colors"
            >
              <Twitter size={18} />
            </Link>
            <Link
              href="https://facebook.com"
              target="_blank"
              className="hover:text-gold transition-colors"
            >
              <Facebook size={18} />
            </Link>
            <Link
              href="https://youtube.com"
              target="_blank"
              className="hover:text-gold transition-colors"
            >
              <Youtube size={18} />
            </Link>
          </div>
        </motion.div>

        {/* Footer Links */}
        {Object.entries(footerLinks).map(([title, links], index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <h3 className="text-sm font-semibold text-brand mb-3 uppercase tracking-wide">
              {title}
            </h3>
            <ul className="space-y-2 text-sm text-charcoal/80">
              {links.map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-gold transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <div className="my-10 border-t border-taupe/20"></div>

      {/* Bottom Section */}
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-charcoal/70">
        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="flex items-center gap-2">
            <Mail size={14} /> support@topeve.com
          </span>
          <span className="hidden sm:inline text-taupe/50">|</span>
          <span className="flex items-center gap-2">
            <Phone size={14} /> +234 800 123 4567
          </span>
          <span className="hidden sm:inline text-taupe/50">|</span>
          <span className="flex items-center gap-2">
            <MapPin size={14} /> Lagos, Nigeria
          </span>
        </div>

        {/* Copyright */}
        <p className="text-center md:text-right text-xs md:text-sm text-charcoal/70">
          © {new Date().getFullYear()} Topeve. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
