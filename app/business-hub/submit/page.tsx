"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SubmitBusinessPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    category: "",
    location: "",
    phone: "",
    email: "",
    website: "",
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("Submitting business...");

    const businessId = `BUS-${Date.now()}`;
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
      status: "Pending",
    });

    if (error) {
      setMessage(error.message);
      setSubmitting(false);
      return;
    }

    setMessage(
      "Business submitted successfully. USBC will review it before publishing."
    );

    setFormData({
      businessName: "",
      ownerName: "",
      category: "",
      location: "",
      phone: "",
      email: "",
      website: "",
      description: "",
    });

    setLogoFile(null);
    setSubmitting(false);
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
            Submit your business, professional service, or community partnership
            for review by the USBC executive team.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-black text-gray-950">
              Business Listing Review
            </h2>

            <div className="rounded-3xl bg-white p-8 shadow-premium">
              <div className="space-y-4 text-gray-700">
                <p>1. Submit your business details.</p>
                <p>2. Upload a business logo if available.</p>
                <p>3. USBC reviews the submission.</p>
                <p>4. Approved businesses appear in the public directory.</p>
                <p>5. USBC may contact you for missing information.</p>
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
              {submitting ? "Submitting..." : "Submit Business"}
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