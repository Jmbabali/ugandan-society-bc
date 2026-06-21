"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (password === "USBC2026Admin") {
      localStorage.setItem("usbc_admin_logged_in", "true");
      router.push("/admin/dashboard");
    } else {
      setMessage("Incorrect admin password.");
    }
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
            type="password"
            required
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border px-4 py-4 text-gray-950"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-gray-950 px-8 py-4 font-bold text-white hover:bg-gray-800"
          >
            Login
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