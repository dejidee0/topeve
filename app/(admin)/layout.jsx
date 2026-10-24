import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import AdminLayoutClient from "./admin-layout-client";
import "../globals.css";
export const metadata = {
  title: "Admin Dashboard - Topevekreation",
  description: "Manage your Topevekreation luxury fashion e-commerce store",
};

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("role")
    .eq("id", user.id)
    .single();

  // Non-admins never receive admin page content; the client layout shows the access-denied screen
  const isAdmin = customer?.role === "admin";

  return (
    <html>
      <body>
        <AdminLayoutClient>{isAdmin ? children : null}</AdminLayoutClient>
      </body>
    </html>
  );
}
