// app/product/[slug]/ProductTabs.jsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description" },
    { id: "details", label: "Product Details" },
    { id: "care", label: "Care Instructions" },
    { id: "shipping", label: "Shipping & Returns" },
  ];

  return (
    <div className="mb-20">
      {/* Tab Navigation */}
      <div className="flex gap-8 border-b border-taupe/20 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative pb-4 font-semibold whitespace-nowrap"
          >
            <span
              className={`transition-colors ${
                activeTab === tab.id
                  ? "text-brand"
                  : "text-charcoal/60 hover:text-brand"
              }`}
            >
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="prose prose-lg max-w-none"
      >
        {activeTab === "description" && (
          <div className="space-y-4 text-charcoal/80">
            <p>
              The <strong>{product.name}</strong> embodies timeless elegance and
              contemporary design. Crafted from premium {product.material}, this
              piece represents the perfect balance of comfort and
              sophistication.
            </p>
            <p>
              Each garment is carefully constructed by skilled artisans who pay
              meticulous attention to every detail. From the initial design
              concept to the final stitch, we ensure that every piece meets our
              exacting standards of quality and craftsmanship.
            </p>
            <p>
              This {product.category} is designed to be a versatile addition to
              your wardrobe, suitable for both casual and formal occasions. The
              classic silhouette ensures it will remain a cherished piece for
              years to come.
            </p>
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-taupe/5 rounded-xl p-6">
                <h3 className="font-semibold text-brand mb-3">
                  Product Specifications
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-charcoal/60">Material:</dt>
                    <dd className="font-medium">{product.material}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-charcoal/60">Category:</dt>
                    <dd className="font-medium capitalize">
                      {product.category}
                    </dd>
                  </div>
                  {product.subcategory && (
                    <div className="flex justify-between">
                      <dt className="text-charcoal/60">Collection:</dt>
                      <dd className="font-medium capitalize">
                        {product.subcategory}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-charcoal/60">Color:</dt>
                    <dd className="font-medium capitalize">{product.color}</dd>
                  </div>
                  {product.size?.length > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-charcoal/60">Available Sizes:</dt>
                      <dd className="font-medium">{product.size.join(", ")}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="bg-taupe/5 rounded-xl p-6">
                <h3 className="font-semibold text-brand mb-3">Features</h3>
                <ul className="space-y-2 text-sm text-charcoal/80">
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Premium quality {product.material}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Ethically sourced materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Handcrafted with attention to detail</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Timeless design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>Made to last</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "care" && (
          <div className="space-y-6">
            <div className="bg-taupe/5 rounded-xl p-6">
              <h3 className="font-semibold text-brand mb-4">
                Care Instructions
              </h3>
              <div className="space-y-3 text-sm text-charcoal/80">
                <p className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Dry clean only for best results</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>
                    If hand washing, use cold water and mild detergent
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Do not bleach or tumble dry</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Iron on low heat if needed</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>
                    Store in a cool, dry place away from direct sunlight
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-gold/10 rounded-xl p-6">
              <h4 className="font-semibold text-brand mb-2">
                Sustainability Note
              </h4>
              <p className="text-sm text-charcoal/80">
                We recommend following these care instructions carefully to
                extend the life of your garment and reduce environmental impact.
                Proper care ensures your piece remains beautiful for years to
                come.
              </p>
            </div>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-6">
            <div className="bg-taupe/5 rounded-xl p-6">
              <h3 className="font-semibold text-brand mb-4">
                Shipping Information
              </h3>
              <div className="space-y-3 text-sm text-charcoal/80">
                <p>
                  <strong>Standard Delivery:</strong> 5-7 business days (₦2,500)
                </p>
                <p>
                  <strong>Express Delivery:</strong> 2-3 business days (₦5,000)
                </p>
                <p>
                  <strong>Free Shipping:</strong> On all orders over ₦50,000
                </p>
                <p className="pt-2">
                  Orders placed before 2 PM (Mon-Fri) will be processed the same
                  day. Weekend orders will be processed the following Monday.
                </p>
              </div>
            </div>

            <div className="bg-taupe/5 rounded-xl p-6">
              <h3 className="font-semibold text-brand mb-4">
                Returns & Exchanges
              </h3>
              <div className="space-y-3 text-sm text-charcoal/80">
                <p>
                  We offer a <strong>30-day return policy</strong> for all
                  unworn items with original tags attached.
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Items must be in original condition</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Original packaging and tags must be intact</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Proof of purchase required</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Free return shipping for defective items</span>
                </p>
                <p className="pt-2">
                  To initiate a return, please contact our customer service team
                  at returns@topeve.com
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
