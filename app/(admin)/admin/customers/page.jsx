import CustomersPageContent from "./content";

export const metadata = {
  title: "Customers - Topeve Admin",
  description: "Manage customer information and track customer activity",
};

export default function CustomersPage() {
  console.log("👥 Customers admin page loaded");

  return <CustomersPageContent />;
}
