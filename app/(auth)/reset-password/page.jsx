// app/auth/reset-password/page.jsx
import { Suspense } from "react";
import ResetPasswordContent from "./content";
export const metadata = {
  title: "Reset Password | Topeve",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-white to-taupe/10">
          <div className="text-brand text-2xl font-heading">Loading...</div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
