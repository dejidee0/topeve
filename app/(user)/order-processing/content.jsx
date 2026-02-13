// app/order-processing/content.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useVerifyPayment } from "@/lib/orders";

export default function OrderProcessingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");

  const [attemptCount, setAttemptCount] = useState(0);
  const { data, isLoading, error, refetch } = useVerifyPayment(reference);

  useEffect(() => {
    if (!reference) {
      router.push("/");
      return;
    }
  }, [reference, router]);

  useEffect(() => {
    if (data?.success && data?.order?.payment_status === "paid") {
      // Small delay before redirect
      setTimeout(() => {
        router.push(`/order-confirmation?reference=${reference}`);
      }, 1500);
    }
  }, [data, reference, router]);

  const handleManualRetry = () => {
    setAttemptCount((prev) => prev + 1);
    refetch();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <div className="text-center max-w-md">
        {isLoading || (!data && !error) ? (
          <>
            <Loader2
              size={64}
              className="animate-spin mx-auto mb-6 text-black"
            />
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl mb-4">
              Verifying Payment
            </h1>
            <p className="text-black/60 mb-2">
              Please wait while we confirm your transaction
            </p>
            <p className="text-sm text-black/40">
              This usually takes a few seconds
            </p>

            {attemptCount > 0 && (
              <p className="text-xs text-black/40 mt-4">
                Verification attempt {attemptCount}...
              </p>
            )}
          </>
        ) : data?.success && data?.order?.payment_status === "paid" ? (
          <>
            <CheckCircle size={64} className="mx-auto mb-6 text-green-600" />
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl mb-4">
              Payment Confirmed!
            </h1>
            <p className="text-black/60 mb-2">Redirecting to your order...</p>
            <div className="flex items-center justify-center gap-2 text-sm text-black/40 mt-4">
              <Loader2 size={16} className="animate-spin" />
              <span>Preparing your confirmation</span>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-6">
              <RefreshCw size={32} className="text-yellow-600" />
            </div>
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl mb-4">
              Verifying Payment
            </h1>
            <p className="text-black/60 mb-6">
              We're still confirming your payment. This may take a moment if
              your network is slow.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleManualRetry}
                className="w-full px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 transition font-semibold flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                <span>Check Again</span>
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full px-6 py-3 border-2 border-black text-black rounded-full hover:bg-black hover:text-white transition font-semibold"
              >
                Return Home
              </button>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-left">
              <p className="font-semibold mb-2">Your order reference:</p>
              <p className="font-mono text-xs bg-white px-3 py-2 rounded border">
                {reference}
              </p>
              <p className="text-xs text-black/60 mt-2">
                Save this reference. If payment was successful, you'll receive a
                confirmation email shortly.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
