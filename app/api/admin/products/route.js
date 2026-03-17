import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

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

// POST /api/admin/products — Create a product
export async function POST(request) {
  try {
    const supabase = getAdminClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("products")
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error("❌ [API] Create product error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

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
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    const { error } = await supabase
      .from("products")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("❌ [API] Delete product error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ [API] Delete product exception:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
