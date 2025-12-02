import ProductsPageContent from "./content";

export const metadata = {
  title: "Products - Topeve Admin",
  description: "Manage your product inventory",
};

export default function ProductsPage() {
  console.log("📦 Products admin page loaded");

  return <ProductsPageContent />;
}
