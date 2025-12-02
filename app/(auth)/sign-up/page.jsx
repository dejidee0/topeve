// app/register/page.jsx
"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Check,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore, useUIStore } from "@/lib/store";

export default function SignUpPage() {
  const { signUp, loading, error, clearError } = useAuthStore();
  const showNotification = useUIStore((state) => state.showNotification);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Memoized password strength calculation
  const calculatePasswordStrength = useCallback((password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === "password") {
        setPasswordStrength(calculatePasswordStrength(value));
      }

      if (error) clearError();
    },
    [error, clearError, calculatePasswordStrength]
  );

  const validateForm = useCallback(() => {
    if (!formData.firstName.trim()) {
      showNotification("Please enter your first name", "warning");
      return false;
    }
    if (!formData.lastName.trim()) {
      showNotification("Please enter your last name", "warning");
      return false;
    }
    if (!formData.email.trim()) {
      showNotification("Please enter your email", "warning");
      return false;
    }
    if (!formData.gender) {
      showNotification("Please select your gender", "warning");
      return false;
    }
    if (formData.password.length < 8) {
      showNotification("Password must be at least 8 characters", "warning");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      showNotification("Passwords do not match", "warning");
      return false;
    }
    if (!agreedToTerms) {
      showNotification("Please agree to the terms and conditions", "warning");
      return false;
    }
    return true;
  }, [formData, agreedToTerms, showNotification]);

  const handleSubmit = async () => {
    console.log("🔵 Form submission started");
    console.log("📝 Form data:", formData);
    console.log("✅ Terms agreed:", agreedToTerms);

    if (!validateForm()) {
      console.log("❌ Validation failed");
      return;
    }

    console.log("✅ Validation passed");
    setIsSubmitting(true);

    try {
      console.log("🚀 Calling signUp...");
      const result = await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        gender: formData.gender,
      });

      console.log("📦 SignUp result:", result);

      if (result.success) {
        setEmailSent(true);
        showNotification("Verification email sent!", "success");

        // Show warning if customer insert failed
        if (result.warning) {
          console.warn("⚠️ Warning:", result.warning);
          showNotification(result.warning, "warning");
        }
      } else {
        console.error("❌ Sign up failed:", result.error);
        showNotification(result.error || "Sign up failed", "error");
      }
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      showNotification("An unexpected error occurred", "error");
    } finally {
      setIsSubmitting(false);
      console.log("🏁 Form submission completed");
    }
  };

  // Handle Enter key press
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !loading && !isSubmitting) {
        handleSubmit();
      }
    },
    [loading, isSubmitting]
  );

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const strengthColors = useMemo(
    () => ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"],
    []
  );

  const strengthLabels = useMemo(
    () => ["", "Weak", "Fair", "Good", "Strong"],
    []
  );

  const benefits = useMemo(
    () => [
      "Welcome discount on your first purchase",
      "Exclusive access to limited collections",
      "Personalized style recommendations",
      "Priority customer support",
    ],
    []
  );

  return (
    <main className="min-h-screen bg-linear-to-br from-cream via-white to-taupe/10">
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
                <motion.div variants={fadeIn} className="text-center mb-8">
                  <Link href="/" className="inline-block mb-4">
                    <h1 className="font-heading text-4xl text-brand">Topeve</h1>
                  </Link>
                  <h2 className="font-heading text-3xl text-brand mb-2">
                    Create Account
                  </h2>
                  <p className="text-charcoal/70">
                    Join the Topeve community today
                  </p>
                </motion.div>

                {/* Form Fields Container */}
                <motion.div variants={fadeIn} className="space-y-4">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-brand mb-2"
                      >
                        First Name
                      </label>
                      <div className="relative">
                        <User
                          size={20}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40"
                          aria-hidden="true"
                        />
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          onKeyPress={handleKeyPress}
                          placeholder="John"
                          className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-taupe/30 rounded-2xl focus:border-brand focus:outline-none transition-colors text-charcoal placeholder:text-charcoal/40"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-brand mb-2"
                      >
                        Last Name
                      </label>
                      <div className="relative">
                        <User
                          size={20}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40"
                          aria-hidden="true"
                        />
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          onKeyPress={handleKeyPress}
                          placeholder="Doe"
                          className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-taupe/30 rounded-2xl focus:border-brand focus:outline-none transition-colors text-charcoal placeholder:text-charcoal/40"
                        />
                      </div>
                    </div>
                  </div>

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
                        aria-hidden="true"
                      />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-taupe/30 rounded-2xl focus:border-brand focus:outline-none transition-colors text-charcoal placeholder:text-charcoal/40"
                      />
                    </div>
                  </div>

                  {/* Gender Field */}
                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-brand mb-2"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-white border-2 border-taupe/30 rounded-2xl focus:border-brand focus:outline-none transition-colors text-charcoal appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%233A3A3A' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem center",
                      }}
                    >
                      <option value="" disabled>
                        Select your gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
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
                        aria-hidden="true"
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-taupe/30 rounded-2xl focus:border-brand focus:outline-none transition-colors text-charcoal placeholder:text-charcoal/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-brand transition-colors"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                level <= passwordStrength
                                  ? strengthColors[passwordStrength]
                                  : "bg-taupe/20"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-charcoal/60">
                          Password strength: {strengthLabels[passwordStrength]}
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
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40"
                        aria-hidden="true"
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-taupe/30 rounded-2xl focus:border-brand focus:outline-none transition-colors text-charcoal placeholder:text-charcoal/40"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-brand transition-colors"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-4 h-4 mt-1 rounded border-taupe/30 text-brand focus:ring-brand focus:ring-offset-0 cursor-pointer"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-charcoal/70 leading-relaxed cursor-pointer"
                    >
                      I agree to Topeve&apos;s{" "}
                      <Link
                        href="/terms"
                        className="text-brand hover:text-gold transition-colors font-medium"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-brand hover:text-gold transition-colors font-medium"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || isSubmitting}
                    className="w-full group flex items-center justify-center gap-2 px-6 py-4 bg-brand text-cream rounded-full font-semibold hover:bg-gold hover:text-brand transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>
                      {isSubmitting ? "Creating account..." : "Create Account"}
                    </span>
                    {!isSubmitting && (
                      <ArrowRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform duration-300"
                      />
                    )}
                  </button>
                </motion.div>

                {/* Sign In Link */}
                <motion.p
                  variants={fadeIn}
                  className="text-center mt-6 text-charcoal/70"
                >
                  Already have an account?{" "}
                  <Link
                    href="/auth/signin"
                    className="text-brand font-semibold hover:text-gold transition-colors"
                  >
                    Sign In
                  </Link>
                </motion.p>
              </motion.div>
            ) : (
              /* Email Verification Screen */
              <motion.div
                key="verification"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gold to-brand rounded-full flex items-center justify-center"
                >
                  <Mail size={40} className="text-white" />
                </motion.div>

                <h2 className="font-heading text-3xl text-brand mb-4">
                  Check Your Email
                </h2>

                <p className="text-lg text-charcoal/80 mb-6 leading-relaxed">
                  We&apos;ve sent a verification link to
                </p>

                <p className="text-xl font-semibold text-brand mb-8 break-all px-4">
                  {formData.email}
                </p>

                <div className="bg-cream/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-taupe/20">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                      <Clock size={16} className="text-brand" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-brand mb-2">
                        Next Steps
                      </h3>
                      <ul className="space-y-2 text-sm text-charcoal/70">
                        <li className="flex items-start gap-2">
                          <Check
                            size={16}
                            className="text-gold mt-0.5 flex-shrink-0"
                          />
                          <span>Click the verification link in your email</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check
                            size={16}
                            className="text-gold mt-0.5 flex-shrink-0"
                          />
                          <span>Complete your account setup</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check
                            size={16}
                            className="text-gold mt-0.5 flex-shrink-0"
                          />
                          <span>Start shopping at Topeve</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-charcoal/60 mb-6">
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setEmailSent(false)}
                    className="text-brand font-semibold hover:text-gold transition-colors"
                  >
                    try again
                  </button>
                </p>

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-gold hover:text-brand transition-colors font-medium"
                >
                  <ArrowRight size={16} className="rotate-180" />
                  Back to Home
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
