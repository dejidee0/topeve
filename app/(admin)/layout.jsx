import AdminLayoutClient from "./admin-layout-client";
import "../globals.css";
export const metadata = {
  title: "Admin Dashboard - Topeve",
  description: "Manage your Topeve luxury fashion e-commerce store",
};

export default function AdminLayout({ children }) {
  return (
    <html>
      <body>
        <AdminLayoutClient>{children}</AdminLayoutClient>;
      </body>
    </html>
  );
}
