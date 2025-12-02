import OrdersPageContent from "./content";

export const metadata = {
  title: "Orders - Topeve Admin",
  description: "Manage customer orders and track sales",
};

export default function OrdersPage() {
  console.log("📋 Orders admin page loaded");

  return <OrdersPageContent />;
}
