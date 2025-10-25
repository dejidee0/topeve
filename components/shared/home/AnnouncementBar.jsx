"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-black text-white py-3 text-center relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 text-sm tracking-wider font-medium">
          <Sparkles className="h-4 w-4" />
          <span>NEW COLLECTION DROPPED</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">
            FREE SHIPPING ON ORDERS OVER $150
          </span>
        </div>
      </div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "linear",
        }}
      />
    </motion.div>
  );
}
