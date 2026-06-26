"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setMessage("Checking admin access...");

    if (password !== "USBC2026Admin") {
      setMessage("Incorrect admin password.");
      setLoggingIn(false);
      return;
    }

    const { data: admin, error } = await supabase
      .from("Admins")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .eq("status", "Active")
      .maybeSingle();

    if (error || !admin) {
      setMessage("No active admin account found for this email.");
      setLoggingIn(false);
      return;
    }

    localStorage.setItem("usbc_admin_logged_in", "true");
    localStorage.setItem("usbc_admin_role", admin.role);
    localStorage.setItem("usbc_admin_name", admin.display_name);
    localStorage.setItem("usbc_admin_email", admin.email);

    router.push("/admin/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-20">
      <div className="mx-auto max-w-md rounded-3xl border bg-white p-8 shadow-premium">
        <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
          USBC Admin
        </p>

        <h1 className="mb-6 text-4xl font-black text-gray-950">
          Admin Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            required
            placeholder="Admin email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border px-4 py-4 text-gray-950"
          />

          <input
            type="password"
            required
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border px-4 py-4 text-gray-950"
          />

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full rounded-xl bg-gray-950 px-8 py-4 font-bold text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {loggingIn ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p className="rounded-xl bg-red-100 p-4 font-bold text-red-700">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}