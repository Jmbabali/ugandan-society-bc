"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function getPlanAmount(plan: string) {
  if (plan === "Annual - $300") return 300;
  if (plan === "Half-Year - $150") return 150;
  if (plan === "Quarterly - $75") return 75;
  return 0;
}

export default function SubmitBusinessPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    category: "",
    location: "",
    phone: "",
    email: "",
    website: "",
    membershipPlan: "",
    description: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function startStripeCheckout(businessId: string) {
    const response = await fetch("/api/create-business-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        businessId,
        businessName: formData.businessName,
        businessEmail: formData.email,
        membershipPlan: formData.membershipPlan,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.url) {
      setMessage(data.error || "Unable to start Stripe checkout.");
      setSubmitting(false);
      return;
    }

    window.location.href = data.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSubmitting(true);
    setMessage("Submitting business application...");

    const businessId = `BUS-${Date.now()}`;
    const paymentAmount = getPlanAmount(formData.membershipPlan);

    if (!paymentAmount) {
      setMessage("Please select a valid Business Hub membership plan.");
      setSubmitting(false);
      return;
    }

    let logoUrl = "";

    if (logoFile) {
      const fileExt = logoFile.name.split(".").pop() || "png";
      const fileName = `${businessId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("business-logos")
        .upload(fileName, logoFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        setMessage(uploadError.message);
        setSubmitting(false);
        return;
      }

      const { data } = supabase.storage
        .from("business-logos")
        .getPublicUrl(fileName);

      logoUrl = data.publicUrl;
    }

    const { error } = await supabase.from("Businesses").insert({
      business_id: businessId,
      business_name: formData.businessName,
      owner_name: formData.ownerName,
      category: formData.category,
      location: formData.location,
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
      logo_url: logoUrl,
      description: formData.description,
      membership_plan: formData.membershipPlan,
      payment_status: "Pending Online Payment",
      payment_amount: paymentAmount,
      payment_method: "Stripe",
      payment_date: null,
      stripe_session_id: null,
      status: "Pending",
    });

    if (error) {
      setMessage(error.message);
      setSubmitting(false);
      return;
    }

    setMessage("Business submitted. Redirecting to secure payment...");
    await startStripeCheckout(businessId);
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gray-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 font-bold uppercase tracking-widest text-yellow-400">
            Business Hub
          </p>

          <h1 className="mb-6 text-4xl font-black md:text-6xl">
            Submit Your Business
          </h1>

          <p className="max-w-3xl text-lg text-gray-300">
            Submit your business for the USBC Business Hub. After submission,
            you will continue to secure Stripe payment.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-black text-gray-950">
              Business Hub Membership
            </h2>

            <div className="rounded-3xl bg-white p-8 shadow-premium">
              <div className="space-y-4 text-gray-700">
                <p>1. Submit your business details.</p>
                <p>2. Select your Business Hub membership plan.</p>
                <p>3. Pay securely through Stripe.</p>
                <p>4. USBC reviews your application.</p>
                <p>5. Approved businesses appear in the public directory.</p>
              </div>

              <div className="mt-8 rounded-2xl bg-yellow-50 p-5">
                <p className="font-black text-gray-950">Membership Plans</p>
                <p className="mt-2 text-gray-700">Annual — $300/year</p>
                <p className="text-gray-700">Half-Year — $150/6 months</p>
                <p className="text-gray-700">Quarterly — $75/3 months</p>
              </div>

              <Link
                href="/business-hub"
                className="mt-8 inline-block rounded-xl bg-gray-950 px-6 py-4 font-bold text-white hover:bg-gray-800"
              >
                Back to Business Hub
              </Link>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl border bg-white p-8 shadow-premium"
          >
            <input
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              required
              placeholder="Business Name"
              className="w-full rounded-xl border px-4 py-4 text-gray-950"
            />

            <input
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              required
              placeholder="Owner / Contact Person"
              className="w-full rounded-xl border px-4 py-4 text-gray-950"
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-xl border px-4 py-4 text-gray-950"
            >
              <option value="">Select Category</option>
              <option>Professional Services</option>
              <option>Construction</option>
              <option>Transportation</option>
              <option>Retail & Trade</option>
              <option>Food & Catering</option>
              <option>Technology</option>
              <option>Health & Wellness</option>
              <option>Other</option>
            </select>

            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Business Location / Address"
              className="w-full rounded-xl border px-4 py-4 text-gray-950"
            />

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full rounded-xl border px-4 py-4 text-gray-950"
            />

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              type="email"
              placeholder="Email Address"
              className="w-full rounded-xl border px-4 py-4 text-gray-950"
            />

            <input
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Website or Social Media Link"
              className="w-full rounded-xl border px-4 py-4 text-gray-950"
            />

            <select
              name="membershipPlan"
              value={formData.membershipPlan}
              onChange={handleChange}
              required
              className="w-full rounded-xl border px-4 py-4 text-gray-950"
            >
              <option value="">Select Business Hub Membership Plan</option>
              <option>Annual - $300</option>
              <option>Half-Year - $150</option>
              <option>Quarterly - $75</option>
            </select>

            <div>
              <label className="mb-2 block text-sm font-bold uppercase text-gray-500">
                Business Logo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className="w-full rounded-xl border bg-white px-4 py-4 text-gray-950"
              />

              <p className="mt-2 text-sm text-gray-500">
                Optional. Upload a logo image for the business listing.
              </p>
            </div>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Brief description of the business"
              className="h-40 w-full rounded-xl border px-4 py-4 text-gray-950"
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gray-950 px-8 py-4 font-bold text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {submitting
                ? "Processing..."
                : "Submit Business & Continue to Payment"}
            </button>

            {message && (
              <p className="rounded-xl bg-yellow-100 p-4 font-bold text-gray-950">
                {message}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}