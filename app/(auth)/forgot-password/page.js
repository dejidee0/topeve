// app/auth/forgot-password/page.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, Check, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore, useUIStore } from "@/lib/store";

export default function ForgotPasswordPage() {
  const { resetPassword, loading, error, clearError } = useAuthStore();
  const showNotification = useUIStore((state) => state.showNotification);

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      showNotification("Please enter your email address", "warning");
      return;
    }

    setIsSubmitting(true);

    const result = await resetPassword(email);

    setIsSubmitting(false);

    if (result.success) {
      setEmailSent(true);
      showNotification("Password reset email sent!", "success");
    } else {
      showNotification(result.error || "Failed to send reset email", "error");
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) clearError();
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-cream via-white to-taupe/10">
      <div className="flex min-h-screen">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
          <AnimatePresence mode="wait">
            {!emailSent ? (
              <motion.div
                key="form"
                initial="hidden"
                animate="show"
                exit="hidden"
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
                  <h2 className="font-heading text-3xl text-brand mb-3">
                    Forgot Password?
                  </h2>
                  <p className="text-charcoal/70 leading-relaxed">
                    No worries! Enter your email and we&apos;ll send you
                    instructions to reset your password.
                  </p>
                </motion.div>

                {/* Illustration */}
                <motion.div
                  variants={fadeIn}
                  className="flex justify-center mb-8"
                >
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold/20 to-brand/20 flex items-center justify-center">
                    <Mail size={64} className="text-brand" />
                  </div>
                </motion.div>

                {/* Form */}
                <motion.form
                  variants={fadeIn}
                  onSubmit={handleSubmit}
                  className="space-y-6"
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
                        value={email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email address"
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-taupe/30 rounded-2xl focus:border-brand focus:outline-none transition-colors text-charcoal placeholder:text-charcoal/40"
                      />
                    </div>
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
                    className="w-full group flex items-center justify-center gap-2 px-6 py-4 bg-brand text-cream rounded-full font-semibold hover:bg-gold hover:text-brand transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>
                      {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </span>
                    {!isSubmitting && (
                      <ArrowRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform duration-300"
                      />
                    )}
                  </button>
                </motion.form>

                {/* Back to Sign In */}
                <motion.div variants={fadeIn} className="text-center mt-8">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-gold hover:text-brand transition-colors font-medium"
                  >
                    <ArrowLeft size={16} />
                    Back to Sign In
                  </Link>
                </motion.div>

                {/* Help Text */}
                <motion.div
                  variants={fadeIn}
                  className="mt-8 p-4 bg-cream/50 rounded-xl border border-taupe/20"
                >
                  <p className="text-sm text-charcoal/70 text-center">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="text-brand font-semibold hover:text-gold transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              /* Email Sent Confirmation */
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center"
                >
                  <Check size={40} className="text-white" />
                </motion.div>

                <h2 className="font-heading text-3xl text-brand mb-4">
                  Check Your Email
                </h2>

                <p className="text-lg text-charcoal/80 mb-6 leading-relaxed">
                  We&apos;ve sent password reset instructions to
                </p>

                <p className="text-xl font-semibold text-brand mb-8 break-all">
                  {email}
                </p>

                <div className="bg-cream/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-taupe/20">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                      <Clock size={16} className="text-brand" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-brand mb-2">
                        What to do next
                      </h3>
                      <ul className="space-y-2 text-sm text-charcoal/70">
                        <li className="flex items-start gap-2">
                          <Check
                            size={16}
                            className="text-gold mt-0.5 flex-shrink-0"
                          />
                          <span>Check your email inbox (and spam folder)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check
                            size={16}
                            className="text-gold mt-0.5 flex-shrink-0"
                          />
                          <span>Click the password reset link</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check
                            size={16}
                            className="text-gold mt-0.5 flex-shrink-0"
                          />
                          <span>Create a new password</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check
                            size={16}
                            className="text-gold mt-0.5 flex-shrink-0"
                          />
                          <span>Sign in with your new password</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-charcoal/60">
                    Didn&apos;t receive the email?{" "}
                    <button
                      onClick={() => setEmailSent(false)}
                      className="text-brand font-semibold hover:text-gold transition-colors"
                    >
                      Resend
                    </button>
                  </p>

                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-gold hover:text-brand transition-colors font-medium"
                  >
                    <ArrowLeft size={16} />
                    Back to Sign In
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side - Brand Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block lg:w-1/2 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand/90 to-gold/80" />
          <Image
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80"
            alt="Topeve Fashion"
            fill
            className="object-cover mix-blend-overlay"
          />

          {/* Overlay Content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-16 text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Mail size={48} className="mb-6" />
              <h3 className="font-heading text-5xl mb-6 leading-tight">
                We&apos;ve Got
                <br />
                You Covered
              </h3>
              <p className="text-lg text-white/90 leading-relaxed max-w-md">
                Password troubles happen to everyone. We&apos;ll help you get
                back to shopping in no time.
              </p>

              {/* Security Features */}
              <div className="mt-12 space-y-4">
                {[
                  "Secure password reset process",
                  "Email verification required",
                  "Your account stays protected",
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <span className="text-white/90">{feature}</span>
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
