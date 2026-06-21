"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [memberId, setMemberId] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const features = [
    "Digital membership card",
    "QR code verification status",
    "Membership renewal reminders",
    "Event registration history",
    "Business Hub submissions",
    "Member announcements and updates",
  ];

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setMessage("Checking membership...");

    const { data, error } = await supabase
      .from("Members")
      .select("*")
      .eq("member_id", memberId.trim())
      .eq("email", email.trim())
      .eq("portal_access", true)
      .single();

    if (error || !data) {
      setMessage("Invalid Member ID or Email. Please check your details.");
      return;
    }

    localStorage.setItem(
      "usbc_member",
      JSON.stringify({
        member_id: data.member_id,
        email: data.email,
      })
    );

    router.push("/member/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gray-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 font-bold uppercase tracking-widest text-yellow-400">
            Member Area
          </p>

          <h1 className="mb-6 text-4xl font-black md:text-6xl">
            Member Login
          </h1>

          <p className="max-w-3xl text-lg text-gray-300 md:text-xl">
            Access your USBC member profile, digital membership ID, payment
            status, renewal status, event registrations, and community updates.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl items-stretch gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border bg-white p-8 shadow-premium md:p-10">
            <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
              Secure Access
            </p>

            <h2 className="mb-8 text-3xl font-black text-gray-950">
              Sign In to Your Account
            </h2>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Member ID
                </label>

                <input
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  required
                  placeholder="Example: USBC-0005"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-gray-950 outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Email Address
                </label>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-gray-950 outline-none focus:border-red-600"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gray-950 px-6 py-4 font-bold text-white transition hover:bg-gray-800"
              >
                Login
              </button>

              {message && (
                <p className="rounded-xl bg-yellow-100 p-4 text-center font-bold text-gray-950">
                  {message}
                </p>
              )}

              <div className="flex flex-wrap justify-between gap-3 text-sm">
                <p className="font-bold text-gray-500">
                  Use your approved Member ID and email.
                </p>

                <Link href="/membership" className="font-bold text-red-600">
                  Apply for membership
                </Link>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-950 p-8 text-white shadow-premium md:p-10">
            <p className="mb-4 font-bold uppercase tracking-widest text-yellow-400">
              Member Portal
            </p>

            <h2 className="mb-6 text-3xl font-black">
              Member Services
            </h2>

            <p className="mb-8 text-gray-300">
              This area supports digital membership services for approved USBC
              members.
            </p>

            <div className="grid gap-4">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-white/10 p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400 font-black text-black">
                    ✓
                  </span>

                  <p className="text-gray-200">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}