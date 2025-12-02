// app/auth/signin/page.jsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore, useUIStore } from "@/lib/store";

export default function SignInPage() {
  const router = useRouter();
  const { signIn, signInWithOAuth, loading, error, clearError } =
    useAuthStore();
  const showNotification = useUIStore((state) => state.showNotification);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await signIn(formData.email, formData.password);

    setIsSubmitting(false);

    if (result.success) {
      showNotification("Welcome back to Topeve!", "success");
      router.push("/");
    } else {
      showNotification(result.error || "Sign in failed", "error");
    }
  };

  const handleOAuthSignIn = async (provider) => {
    const result = await signInWithOAuth(provider);
    if (result.success) {
      showNotification("Redirecting...", "info");
    } else {
      showNotification(result.error || "OAuth sign in failed", "error");
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-cream via-white to-taupe/10">
      <div className="flex min-h-screen">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="w-full max-w-md"
          >
            {/* Logo & Title */}
            <motion.div variants={fadeIn} className="text-center mb-10">
              <Link href="/" className="inline-block mb-6">
                <h1 className="font-heading text-4xl text-brand">Topeve</h1>
              </Link>
              <h2 className="font-heading text-3xl text-brand mb-2">
                Welcome Back
              </h2>
              <p className="text-charcoal/70">
                Sign in to continue your shopping experience
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              variants={fadeIn}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-brand mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40"
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-taupe/30 rounded-2xl focus:border-brand focus:outline-none transition-colors text-charcoal placeholder:text-charcoal/40"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-brand mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-taupe/30 rounded-2xl focus:border-brand focus:outline-none transition-colors text-charcoal placeholder:text-charcoal/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-brand transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-taupe/30 text-brand focus:ring-brand focus:ring-offset-0"
                  />
                  <span className="text-charcoal/70 group-hover:text-brand transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-gold hover:text-brand transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || isSubmitting}
                className="w-full group flex items-center justify-center gap-2 px-6 py-4 bg-brand text-cream rounded-full font-semibold hover:bg-gold hover:text-brand transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
                {!isSubmitting && (
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                )}
              </button>
            </motion.form>

            {/* Sign Up Link */}
            <motion.p
              variants={fadeIn}
              className="text-center mt-8 text-charcoal/70"
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-brand font-semibold hover:text-gold transition-colors"
              >
                Create Account
              </Link>
            </motion.p>
          </motion.div>
        </div>

        {/* Right Side - Brand Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block lg:w-1/2 relative"
        >
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
            alt="Topeve Fashion"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-brand/80 to-gold/60 opacity-45" />

          {/* Overlay Content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-16 text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h3 className="font-heading text-5xl mb-6 font-semibold leading-tight">
                Luxury Fashion,
                <br />
                Curated for You
              </h3>
              <p className="text-xl text-white/90 leading-relaxed max-w-md">
                Join thousands of style enthusiasts who trust Topeve for
                premium, sustainable fashion pieces.
              </p>

              {/* Features */}
              <div className="mt-12 space-y-4">
                {[
                  "Exclusive collections from premium brands",
                  "Early access to seasonal sales",
                  "Personalized styling recommendations",
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <span className="text-white">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
