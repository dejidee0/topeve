import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient as createSessionClient } from "@/supabase/server";

// Columns the admin product form is allowed to write
const PRODUCT_FIELDS = [
  "name",
  "slug",
  "category",
  "subcategory",
  "price",
  "currency",
  "color",
  "size",
  "material",
  "tags",
  "image",
  "description",
  "in_stock",
  "sku",
  "stock_quantity",
  "low_stock_threshold",
  "meta_title",
  "meta_description",
];

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase service credentials");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Returns an error response unless the caller is a signed-in admin
async function requireAdmin(supabase) {
  const sessionClient = await createSessionClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("role")
    .eq("id", user.id)
    .single();

  if (customer?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}

function pickProductFields(body) {
  return Object.fromEntries(
    Object.entries(body).filter(([key]) => PRODUCT_FIELDS.includes(key))
  );
}

// Storefront pages are ISR-cached; purge them so admin changes show immediately
function revalidateStorefront(...slugs) {
  revalidatePath("/");
  revalidatePath("/products");
  for (const slug of new Set(slugs.filter(Boolean))) {
    revalidatePath(`/products/${slug}`);
  }
}

// POST /api/admin/products — Create a product
export async function POST(request) {
  try {
    const supabase = getAdminClient();
    const denied = await requireAdmin(supabase);
    if (denied) return denied;

    const body = pickProductFields(await request.json());

    const { data, error } = await supabase
      .from("products")
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error("❌ [API] Create product error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidateStorefront(data.slug);
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error("❌ [API] Create product exception:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/admin/products — Update a product
export async function PATCH(request) {
  try {
    const supabase = getAdminClient();
    const denied = await requireAdmin(supabase);
    if (denied) return denied;

    const { id, ...rest } = await request.json();
    const updates = pickProductFields(rest);

    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    // Previous slug, so its page is purged if the slug changes
    const { data: existing } = await supabase
      .from("products")
      .select("slug")
      .eq("id", id)
      .single();

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("❌ [API] Update product error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidateStorefront(existing?.slug, data.slug);
    return NextResponse.json({ data });
  } catch (err) {
    console.error("❌ [API] Update product exception:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/products?id=<uuid> — Soft-delete a product
export async function DELETE(request) {
  try {
    const supabase = getAdminClient();
    const denied = await requireAdmin(supabase);
    if (denied) return denied;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("products")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .select("slug");

    if (error) {
      console.error("❌ [API] Delete product error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidateStorefront(...data.map((p) => p.slug));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ [API] Delete product exception:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
