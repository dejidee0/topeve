// app/about/content.jsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Shield,
  Heart,
  Truck,
  Star,
  Award,
  Users,
  TrendingUp,
  Globe,
  ArrowRight,
  Check,
  Zap,
  Crown,
  Flag,
} from "lucide-react";

export default function AboutContent() {
  const stats = [
    { value: "2024", label: "Founded", icon: Flag },
    { value: "500+", label: "Happy Customers", icon: Users },
    { value: "100+", label: "Premium Products", icon: Crown },
    { value: "99%", label: "Satisfaction Rate", icon: Heart },
  ];

  const values = [
    {
      icon: Shield,
      title: "Authenticity Guaranteed",
      description:
        "Every piece in our collection is carefully curated and verified for authenticity. We partner directly with brands and authorized distributors.",
      color: "from-amber-200 to-amber-600", // cream → warm brown
    },
    {
      icon: Star,
      title: "Uncompromising Quality",
      description:
        "We believe luxury is in the details. From fabric selection to final packaging, excellence is our standard, not our goal.",
      color: "from-stone-200 to-stone-600", // soft cream → stone brown
    },
    {
      icon: Heart,
      title: "Customer-First Philosophy",
      description:
        "Your satisfaction drives everything we do. Our dedicated team ensures your shopping experience is seamless, personalized, and memorable.",
      color: "from-orange-100 to-orange-700", // light beige → deep brown-orange
    },
    {
      icon: Globe,
      title: "Global Standards, Local Touch",
      description:
        "We bring international luxury to Nigeria while celebrating our rich culture. Experience world-class service tailored to your needs.",
      color: "from-neutral-200 to-neutral-700", // soft cream → dark neutral brown
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: "The Beginning",
      description:
        "Topeve was born from a vision to transform Nigeria's luxury fashion landscape.",
    },
    {
      year: "Q2 2024",
      title: "Platform Launch",
      description:
        "Launched our e-commerce platform with 200+ premium products from global brands.",
    },
    {
      year: "Q3 2024",
      title: "Rapid Growth",
      description:
        "Reached 5,000 customers across Lagos, Abuja, and Port Harcourt.",
    },
    {
      year: "Q4 2024",
      title: "Category Expansion",
      description:
        "Added jewelry, cosmetics, and bridal collections to our offerings.",
    },
  ];

  const whyChooseUs = [
    {
      icon: Truck,
      title: "Fast & Secure Delivery",
      description: "Swift delivery across Nigeria with real-time tracking",
    },
    {
      icon: Shield,
      title: "100% Authentic Products",
      description: "Every item verified and guaranteed genuine",
    },
    {
      icon: Award,
      title: "Premium Packaging",
      description: "Luxury unboxing experience with every order",
    },
    {
      icon: Zap,
      title: "Easy Returns",
      description: "Hassle-free returns within 14 days",
    },
  ];

  return (
    <div className="min-h-screen ">
      {/* Hero Section - Asymmetric Split */}
      <section className="relative min-h-[90vh] overflow-hidden bg-cre">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#2C1810_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 rounded-full mb-6">
                <Users size={18} className="text-brand" />
                <span className="text-sm font-semibold text-brand">
                  About Topeve
                </span>
              </div>

              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-brand mb-6 leading-tight">
                Redefining
                <br />
                <span className="text-gold">Luxury Fashion</span>
                <br />
                in Nigeria
              </h1>

              <p className="text-lg md:text-xl text-charcoal/70 mb-8 leading-relaxed">
                At Topeve, we believe luxury should be accessible, authentic,
                and extraordinary. We're not just an e-commerce platform—we're
                your gateway to the world's finest fashion, delivered to your
                doorstep with Nigerian warmth.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-cream rounded-full hover:bg-gold hover:text-brand transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  Explore Collection
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-brand text-brand rounded-full hover:bg-brand hover:text-cream transition-all duration-300 font-semibold"
                >
                  Get in Touch
                </Link>
              </div>
            </motion.div>

            {/* Right - Image Collage */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative grid grid-cols-2 gap-4">
                {/* Top Left - Large */}
                <div className="col-span-2 relative h-64 rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80"
                    alt="Luxury Fashion Store"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/60 to-transparent" />
                </div>

                {/* Bottom Left */}
                <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80"
                    alt="Premium Fashion"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Bottom Right */}
                <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1493655161922-ef98929de9d8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Luxury Accessories"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 bg-gold text-brand px-6 py-3 rounded-full shadow-xl font-bold">
                  Est. 2024
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Horizontal Scroll Cards */}
      <section className="py-20 bg-gradient-to-b from-cream to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-brand to-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={28} className="text-cream" />
                  </div>
                  <div className="font-heading text-4xl text-brand mb-2">
                    {stat.value}
                  </div>
                  <div className="text-charcoal/60 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section - Bento Grid Style */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-brand mb-4">
              Our Story
            </h2>
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
              From a vision to revolutionize luxury shopping in Nigeria to
              becoming a trusted name in premium fashion.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Main Story Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:row-span-2 bg-gradient-to-br from-brand to-charcoal rounded-3xl p-10 text-cream shadow-2xl"
            >
              <Crown size={48} className="text-gold mb-6" />
              <h3 className="font-heading text-3xl mb-6 text-gold">
                Born from a Vision
              </h3>
              <div className="space-y-4 text-cream/90 leading-relaxed">
                <p>
                  Topeve was founded on a simple yet powerful belief: Nigerian
                  fashion enthusiasts deserve access to the world's finest
                  luxury brands without compromise.
                </p>
                <p>
                  We saw a gap in the market—authentic luxury fashion was either
                  unavailable or difficult to access. We set out to change that.
                </p>
                <p>
                  Today, Topeve stands as Nigeria's premier destination for
                  verified luxury fashion, combining global standards with local
                  understanding. Every product we offer is carefully curated,
                  every customer interaction is personalized, and every delivery
                  is an experience.
                </p>
                <p className="text-gold font-semibold pt-4">
                  We're not just selling fashion—we're building a community of
                  discerning individuals who appreciate quality, authenticity,
                  and exceptional service.
                </p>
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-cream border-2 border-taupe/30 rounded-3xl p-8 hover:border-gold transition-all duration-300"
            >
              <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-cream" />
              </div>
              <h3 className="font-heading text-2xl text-brand mb-4">
                Our Mission
              </h3>
              <p className="text-charcoal/70 leading-relaxed">
                To democratize access to authentic luxury fashion in Nigeria,
                making it seamless for everyone to express their style with
                confidence and sophistication.
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-linear-to-br from-gold/20 to-amber/10 rounded-3xl p-8 border-2 border-gold/30 hover:border-gold transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center mb-4">
                <Globe size={24} className="text-brand" />
              </div>
              <h3 className="font-heading text-2xl text-brand mb-4">
                Our Vision
              </h3>
              <p className="text-charcoal/70 leading-relaxed">
                To become Africa's leading luxury fashion platform, setting the
                standard for authenticity, customer experience, and innovation
                in online luxury retail.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section - Card Grid with Hover Effects */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-brand mb-4">
              What We Stand For
            </h2>
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
              Our core values guide every decision we make and every interaction
              we have.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  {/* Gradient Background on Hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />

                  <div className="relative">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                    >
                      <Icon size={28} className="text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="font-heading text-2xl text-brand mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand group-hover:to-gold transition-all duration-500">
                      {value.title}
                    </h3>
                    <p className="text-charcoal/70 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section - Horizontal Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-brand mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
              Key milestones in our mission to transform luxury fashion in
              Nigeria.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line - Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand via-gold to-brand" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row gap-8 items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div
                      className={`bg-cream rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                        index % 2 === 0 ? "md:text-right" : "md:text-left"
                      }`}
                    >
                      <div
                        className={`inline-block px-4 py-2 bg-gradient-to-r from-brand to-gold text-cream rounded-full font-bold mb-4`}
                      >
                        {milestone.year}
                      </div>
                      <h3 className="font-heading text-2xl text-brand mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-charcoal/70 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden md:flex w-6 h-6 bg-gradient-to-br from-brand to-gold rounded-full border-4 border-white shadow-lg z-10 flex-shrink-0" />

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Icon Grid */}
      <section className="py-24 bg-gradient-to-b from-cream to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-brand mb-4">
              Why Choose Topeve
            </h2>
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
              Experience the difference of shopping with Nigeria's premier
              luxury fashion platform.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl p-6 text-center hover:bg-brand transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  <div className="w-14 h-14 bg-brand/10 group-hover:bg-cream rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                    <Icon
                      size={24}
                      className="text-brand group-hover:text-brand transition-colors duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-brand group-hover:text-cream mb-2 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-charcoal/60 group-hover:text-cream/80 transition-colors duration-300">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Split Design */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
            alt="Luxury Shopping"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand/95 to-charcoal/90" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-cream"
            >
              <h2 className="font-heading text-4xl md:text-5xl mb-6 text-cream">
                Ready to Experience
                <br />
                <span className="text-gold">True Luxury?</span>
              </h2>
              <p className="text-xl text-cream/90 mb-8 leading-relaxed">
                Join thousands of satisfied customers who trust Topeve for their
                luxury fashion needs. Start your journey today.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-brand rounded-full hover:bg-cream hover:text-brand transition-all duration-300 font-semibold shadow-xl"
                >
                  Shop Now
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-cream text-cream rounded-full hover:bg-cream hover:text-brand transition-all duration-300 font-semibold"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>

            {/* Right - Feature List */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {[
                "Curated luxury collections",
                "100% authentic products",
                "Secure payment options",
                "Fast nationwide delivery",
                "Dedicated customer support",
                "Exclusive member benefits",
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4"
                >
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center shrink-0">
                    <Check size={18} className="text-brand" />
                  </div>
                  <span className="text-cream font-medium">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
