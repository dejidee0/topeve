// app/product/[slug]/ReviewSection.jsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, CheckCircle } from "lucide-react";

const MOCK_REVIEWS = [
  {
    id: 1,
    author: "Amara O.",
    rating: 5,
    date: "2025-10-15",
    title: "Absolutely stunning!",
    content:
      "The quality exceeded my expectations. The fabric is luxurious and the fit is perfect. Worth every naira!",
    verified: true,
    helpful: 24,
  },
  {
    id: 2,
    author: "Chidi K.",
    rating: 5,
    date: "2025-10-10",
    title: "Premium quality",
    content:
      "This is my third purchase from Topeve and they never disappoint. The attention to detail is remarkable.",
    verified: true,
    helpful: 18,
  },
  {
    id: 3,
    author: "Folake A.",
    rating: 4,
    date: "2025-10-05",
    title: "Beautiful piece",
    content:
      "Love the design and material. Took one star off because shipping took a bit longer than expected, but the product itself is perfect.",
    verified: true,
    helpful: 12,
  },
  {
    id: 4,
    author: "Tunde M.",
    rating: 5,
    date: "2025-09-28",
    title: "Highly recommend",
    content:
      "Elegant and well-made. The craftsmanship is evident in every stitch. Will definitely be buying more.",
    verified: true,
    helpful: 9,
  },
];

export default function ReviewSection() {
  const [sortBy, setSortBy] = useState("helpful");

  const averageRating = 4.8;
  const totalReviews = 127;

  const ratingDistribution = [
    { stars: 5, count: 98, percentage: 77 },
    { stars: 4, count: 20, percentage: 16 },
    { stars: 3, count: 6, percentage: 5 },
    { stars: 2, count: 2, percentage: 1 },
    { stars: 1, count: 1, percentage: 1 },
  ];

  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-3xl text-brand">Customer Reviews</h2>
        <button className="px-6 py-2.5 rounded-full bg-brand text-cream font-medium hover:bg-gold hover:text-brand transition-all duration-300">
          Write a Review
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Rating Summary */}
        <div className="lg:col-span-1 bg-taupe/5 rounded-2xl p-8 space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-brand mb-2">
              {averageRating}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={`${
                    i < Math.floor(averageRating)
                      ? "fill-gold text-gold"
                      : "fill-taupe/30 text-taupe/30"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-charcoal/70">
              Based on {totalReviews} reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-3">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium">{item.stars}</span>
                  <Star size={12} className="fill-gold text-gold" />
                </div>
                <div className="flex-1 h-2 bg-taupe/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-charcoal/60 w-12 text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sort Dropdown */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-charcoal/70">
              Showing {MOCK_REVIEWS.length} of {totalReviews} reviews
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-taupe/30 rounded-full px-4 py-2 bg-white outline-none focus:ring-1 focus:ring-gold/40"
            >
              <option value="helpful">Most Helpful</option>
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>

          {/* Review Cards */}
          <div className="space-y-6">
            {MOCK_REVIEWS.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-taupe/20 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-brand">
                        {review.author}
                      </h4>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle size={14} />
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${
                            i < review.rating
                              ? "fill-gold text-gold"
                              : "fill-taupe/30 text-taupe/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-charcoal/60">
                    {new Date(review.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Review Content */}
                <h5 className="font-semibold text-brand mb-2">
                  {review.title}
                </h5>
                <p className="text-charcoal/80 mb-4">{review.content}</p>

                {/* Review Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-taupe/10">
                  <button className="flex items-center gap-2 text-sm text-charcoal/60 hover:text-brand transition-colors">
                    <ThumbsUp size={16} />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center pt-6">
            <button className="px-8 py-3 rounded-full border-2 border-brand text-brand font-medium hover:bg-brand hover:text-cream transition-all duration-300">
              Load More Reviews
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
