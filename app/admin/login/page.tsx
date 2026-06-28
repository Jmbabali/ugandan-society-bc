"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Invalid email or password.");
        setLoggingIn(false);
        return;
      }

      localStorage.setItem("usbc_admin_logged_in", "true");
      localStorage.setItem("usbc_admin_role", result.admin.role);
      localStorage.setItem("usbc_admin_name", result.admin.display_name);
      localStorage.setItem("usbc_admin_email", result.admin.email);

      if (result.admin.force_password_change === true) {
        router.push("/admin/change-password");
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setMessage("Unable to login. Please try again.");
      setLoggingIn(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-20">
      <div className="mx-auto max-w-md rounded-3xl border bg-white p-8 shadow-xl">
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