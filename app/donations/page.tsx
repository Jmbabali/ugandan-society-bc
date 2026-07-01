"use client";

import { useState } from "react";

export default function DonationsPage() {
  const [form, setForm] = useState({
    donorName: "",
    donorEmail: "",
    category: "",
    amount: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleDonation(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("Opening secure Stripe checkout...");

    const response = await fetch("/api/create-donation-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Unable to start donation.");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gray-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 font-bold uppercase tracking-widest text-yellow-400">
            Donate
          </p>

          <h1 className="mb-6 text-4xl font-black md:text-6xl">
            Support USBC Community Programs
          </h1>

          <p className="max-w-3xl text-lg text-gray-300">
            Your donation helps support community events, cultural programs,
            newcomer support, youth activities, and USBC community initiatives.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <form
          onSubmit={handleDonation}
          className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-premium"
        >
          <h2 className="mb-6 text-3xl font-black text-gray-950">
            Make a Donation
          </h2>

          <div className="space-y-5">
            <input
              name="donorName"
              value={form.donorName}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="w-full rounded-xl border px-4 py-4 text-gray-950"
            />

            <input
              name="donorEmail"
              value={form.donorEmail}
              onChange={handleChange}
              required
              type="email"
              placeholder="Email Address"
              className="w-full rounded-xl border px-4 py-4 text-gray-950"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-xl border px-4 py-4 text-gray-950"
            >
              <option value="">Select Donation Category</option>
              <option>General Support</option>
              <option>Community Events</option>
              <option>Youth Programs</option>
              <option>Newcomer Support</option>
              <option>Cultural Programs</option>
              <option>Emergency Community Support</option>
              <option>Compassionate Fund</option>
            </select>

            <input
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              type="number"
              min="1"
              step="1"
              placeholder="Donation Amount CAD"
              className="w-full rounded-xl border px-4 py-4 text-gray-950"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black hover:bg-yellow-300 disabled:opacity-60"
            >
              {loading ? "Opening Stripe..." : "Donate Securely"}
            </button>

            {message && (
              <p className="rounded-xl bg-yellow-100 p-4 font-bold text-gray-950">
                {message}
              </p>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}