// app/auth/reset-password/page.jsx
export const dynamic = "force-dynamic";
("use client");

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight, Check, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore, useUIStore } from "@/lib/store";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updatePassword, loading, error, clearError } = useAuthStore();
  const showNotification = useUIStore((state) => state.showNotification);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Check if we have a valid reset token
  useEffect(() => {
    const token = searchParams.get("token");
    const type = searchParams.get("type");

    if (!token || type !== "recovery") {
      showNotification("Invalid or expired reset link", "error");
      setTimeout(() => router.push("/auth/forgot-password"), 3000);
    }
  }, [searchParams, router, showNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Calculate password strength
    if (name === "password") {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++;
      if (/\d/.test(value)) strength++;
      if (/[@$!%*?&]/.test(value)) strength++;
      setPasswordStrength(strength);
    }

    if (error) clearError();
  };

  const validateForm = () => {
    if (formData.password.length < 8) {
      showNotification("Password must be at least 8 characters", "warning");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      showNotification("Passwords do not match", "warning");
      return false;
    }
    if (passwordStrength < 2) {
      showNotification("Please choose a stronger password", "warning");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const result = await updatePassword(formData.password);

    setIsSubmitting(false);

    if (result.success) {
      setResetSuccess(true);
      showNotification("Password updated successfully!", "success");
      setTimeout(() => router.push("/auth/signin"), 3000);
    } else {
      showNotification(result.error || "Failed to reset password", "error");
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const strengthColors = [
    "",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    {
      label: "Contains uppercase & lowercase",
      met: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password),
    },
    { label: "Contains a number", met: /\d/.test(formData.password) },
    {
      label: "Contains special character",
      met: /[@$!%*?&]/.test(formData.password),
    },
  ];

  if (resetSuccess) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-cream via-white to-taupe/10 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
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
            Password Reset Complete!
          </h2>

          <p className="text-lg text-charcoal/80 mb-8 leading-relaxed">
            Your password has been successfully updated. You can now sign in
            with your new password.
          </p>

          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand text-cream rounded-full font-semibold hover:bg-gold hover:text-brand transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Continue to Sign In</span>
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cream via-white to-taupe/10">
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
              <h2 className="font-heading text-3xl text-brand mb-3">
                Create New Password
              </h2>
              <p className="text-charcoal/70 leading-relaxed">
                Choose a strong password to secure your account
              </p>
            </motion.div>

            {/* Security Badge */}
            <motion.div variants={fadeIn} className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-brand/20 flex items-center justify-center">
                <Shield size={40} className="text-brand" />
              </div>
            </motion.div>

            {/* Form */}
            <motion.form
              variants={fadeIn}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* New Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-brand mb-2"
                >
                  New Password
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
                    placeholder="Enter new password"
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            level <= passwordStrength
                              ? strengthColors[passwordStrength]
                              : "bg-taupe/20"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-medium text-charcoal/70">
                      Password strength:{" "}
                      <span
                        className={
                          passwordStrength >= 3
                            ? "text-green-600"
                            : "text-orange-600"
                        }
                      >
                        {strengthLabels[passwordStrength]}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-brand mb-2"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40"
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm new password"
                    className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-taupe/30 rounded-2xl focus:border-brand focus:outline-none transition-colors text-charcoal placeholder:text-charcoal/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-brand transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-cream/50 backdrop-blur-sm rounded-xl p-4 border border-taupe/20">
                <h4 className="text-sm font-semibold text-brand mb-3">
                  Password Requirements
                </h4>
                <ul className="space-y-2">
                  {passwordRequirements.map((req, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-2 text-sm transition-colors ${
                        req.met ? "text-green-600" : "text-charcoal/60"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          req.met ? "bg-green-500" : "bg-taupe/20"
                        }`}
                      >
                        {req.met && <Check size={12} className="text-white" />}
                      </div>
                      <span>{req.label}</span>
                    </li>
                  ))}
                </ul>
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
                  {isSubmitting ? "Updating password..." : "Reset Password"}
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
            <motion.p
              variants={fadeIn}
              className="text-center mt-8 text-charcoal/70"
            >
              Remember your password?{" "}
              <Link
                href="/auth/signin"
                className="text-brand font-semibold hover:text-gold transition-colors"
              >
                Sign In
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
          <div className="absolute inset-0 bg-gradient-to-br from-brand/90 to-gold/80" />
          <Image
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80"
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
              <Shield size={48} className="mb-6" />
              <h3 className="font-heading text-5xl mb-6 leading-tight">
                Secure Your
                <br />
                Account
              </h3>
              <p className="text-lg text-white/90 leading-relaxed max-w-md mb-12">
                Create a strong password to keep your Topeve account safe and
                secure.
              </p>

              {/* Security Tips */}
              <div className="space-y-4">
                <h4 className="font-semibold text-xl mb-4">Security Tips:</h4>
                {[
                  "Use a unique password you don't use elsewhere",
                  "Mix uppercase, lowercase, numbers & symbols",
                  "Avoid personal information like birthdays",
                  "Consider using a password manager",
                ].map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <Check
                      size={20}
                      className="text-gold flex-shrink-0 mt-0.5"
                    />
                    <span className="text-white/90 text-sm leading-relaxed">
                      {tip}
                    </span>
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
