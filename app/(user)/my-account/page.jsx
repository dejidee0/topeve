// app/account/page.jsx
import { Suspense } from "react";
import AccountPageContent from "./content";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Account | Topeve",
  description: "Manage your account and view order history",
};

function AccountSkeleton() {
  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-10 w-48 bg-taupe/20 rounded-lg mb-8 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="h-96 bg-white rounded-2xl animate-pulse" />
          <div className="lg:col-span-3 h-96 bg-white rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountSkeleton />}>
      <AccountPageContent />
    </Suspense>
  );
}
