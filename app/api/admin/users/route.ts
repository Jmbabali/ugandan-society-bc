import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("Admins")
    .select("*")
    .order("display_name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data || [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, id, display_name, email, role, status, password } = body;

  if (action === "create") {
    if (!password) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { error } = await supabaseAdmin.from("Admins").insert({
      display_name,
      email: email.toLowerCase().trim(),
      role,
      status,
      password_hash,
      force_password_change: true,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  }

  if (action === "update") {
    const payload: any = {
      display_name,
      email: email.toLowerCase().trim(),
      role,
      status,
    };

    if (password) {
      payload.password_hash = await bcrypt.hash(password, 10);
      payload.force_password_change = true;
    }

    const { error } = await supabaseAdmin
      .from("Admins")
      .update(payload)
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  }

  if (action === "resetPassword") {
    const password_hash = await bcrypt.hash(password, 10);

    const { error } = await supabaseAdmin
      .from("Admins")
      .update({
        password_hash,
        force_password_change: true,
      })
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  }

  if (action === "toggleStatus") {
    const { error } = await supabaseAdmin
      .from("Admins")
      .update({ status })
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  }

  if (action === "delete") {
    const { error } = await supabaseAdmin.from("Admins").delete().eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}