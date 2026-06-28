import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const { data: admin, error } = await supabaseAdmin
      .from("Admins")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (error || !admin) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (admin.status !== "Active") {
      return NextResponse.json(
        { error: "This admin account is not active." },
        { status: 403 }
      );
    }

    if (!admin.password_hash) {
      return NextResponse.json(
        { error: "Password has not been set for this admin account." },
        { status: 403 }
      );
    }

    const passwordMatches = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        email: admin.email,
        role: admin.role,
        display_name: admin.display_name,
        force_password_change: admin.force_password_change,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to login. Please try again." },
      { status: 500 }
    );
  }
}