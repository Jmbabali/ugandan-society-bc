"use client";

import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();

    const email = localStorage.getItem("usbc_admin_email");

    if (!email) {
      setMessage("Session expired. Please log in again.");
      router.push("/admin/login");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setSaving(true);
    setMessage("Saving password...");

    const password_hash = await bcrypt.hash(password, 10);

    const { error } = await supabase
      .from("Admins")
      .update({
        password_hash,
        force_password_change: false,
      })
      .eq("email", email);

    setSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password changed successfully.");
    router.push("/admin/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-20">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl">
       <p className="mb-2 text-center font-bold uppercase tracking-[0.35em] text-red-600">
  Ugandan Society in BC
</p>

<h1 className="mb-4 text-center text-4xl font-black text-gray-950">
  Welcome to the Executive Portal
</h1>

<p className="mb-8 text-center leading-7 text-gray-600">
  This is your first login.
  <br />
  For your security, please create a personal password before continuing.
</p>

        <form onSubmit={handleChangePassword} className="space-y-5">
          <input
            type="password"
            required
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border px-4 py-4 text-gray-950"
          />

          <input
            type="password"
            required
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border px-4 py-4 text-gray-950"
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-gray-950 px-8 py-4 font-bold text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Change Password"}
          </button>

          {message && (
            <p className="rounded-xl bg-yellow-100 p-4 font-bold text-gray-800">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}