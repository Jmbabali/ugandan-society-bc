"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import MembershipHero from "@/app/components/membership/Hero";
import MembershipBenefits from "@/app/components/membership/Benefits";
import MembershipPlans from "@/app/components/membership/Plans";

export default function MembershipPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    membershipType: "",
    memberCategory: "",
    emergencyContact: "",
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) setPhoto(e.target.files[0]);
  }

  function getPaymentAmount(membershipType: string) {
    if (membershipType === "Adults - $50") return 50;
    if (membershipType === "Student Member - $30") return 30;
    if (membershipType === "Corporate / Partner - $200") return 200;
    if (membershipType === "Honorary - $0") return 0;
    return 0;
  }

  async function startStripeCheckout(memberId: string, paymentAmount: number) {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        membershipType: formData.membershipType,
        memberName: `${formData.firstName} ${formData.lastName}`,
        memberEmail: formData.email,
        memberId,
        amount: paymentAmount,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.url) {
      setMessage(data.error || "Could not start online payment.");
      setSubmitting(false);
      return;
    }

    window.location.href = data.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("Submitting application...");

    let photoUrl = "";

    if (photo) {
      const fileExt = photo.name.split(".").pop() || "jpg";
      const safeFileName = `photo-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("member-photos")
        .upload(safeFileName, photo, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setMessage(uploadError.message);
        setSubmitting(false);
        return;
      }

      const { data } = supabase.storage
        .from("member-photos")
        .getPublicUrl(safeFileName);

      photoUrl = data.publicUrl;
    }

    const temporaryMemberId = `PENDING-${Date.now()}`;
    const paymentAmount = getPaymentAmount(formData.membershipType);

    const { error } = await supabase.from("Members").insert({
      member_id: temporaryMemberId,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      membership_type: formData.membershipType,
      member_category: formData.memberCategory,
      emergency_contact: formData.emergencyContact,
      photo_url: photoUrl,
      status: "Pending",
      payment_status: paymentAmount === 0 ? "Not Required" : "Pending Online Payment",
      payment_amount: paymentAmount,
      payment_method: paymentAmount === 0 ? "Not Required" : "Stripe",
      payment_date: null,
      stripe_session_id: null,
    });

    if (error) {
      setMessage(error.message);
      setSubmitting(false);
      return;
    }

    if (paymentAmount > 0) {
      setMessage("Application submitted. Redirecting to secure payment...");
      await startStripeCheckout(temporaryMemberId, paymentAmount);
      return;
    }

    setMessage("Application submitted successfully. No payment is required for this membership type.");

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      membershipType: "",
      memberCategory: "",
      emergencyContact: "",
    });

    setPhoto(null);
    setSubmitting(false);
  }

  const membershipTypes = [
    ["Adults", "$50", "One adult member"],
    ["Student Member", "$30", "Full-time student with ID"],
    ["Corporate / Partner", "$200", "Business or organization supporting the mission"],
    ["Honorary", "$0", "Awarded by the Board"],
  ];

 return (
  <main className="min-h-screen bg-gray-100">
    <MembershipHero />
    <MembershipBenefits />
    <MembershipPlans />

    <section id="application" className="bg-white px-6 py-20">
      <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-2">
        <div>
          <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
            Membership Application
          </p>

          <h2 className="mb-6 text-3xl font-black text-gray-950 md:text-5xl">
            Apply to Become a Member
          </h2>

          <p className="mb-8 text-lg text-gray-700">
            Complete the form. Paid memberships will continue to secure online
            payment after submission.
          </p>

          <div className="rounded-3xl bg-gray-950 p-8 text-white shadow-lg">
            <p className="mb-4 font-bold uppercase tracking-widest text-yellow-400">
              Application Process
            </p>

            <div className="space-y-4 text-gray-300">
              <p>1. Submit application</p>
              <p>2. Pay membership fee securely online</p>
              <p>3. USBC confirms payment</p>
              <p>4. USBC reviews and approves application</p>
              <p>5. Official USBC member ID is issued after approval</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border bg-gray-50 p-8 shadow-lg md:p-10"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="First Name"
              className="rounded-xl border px-4 py-4 text-gray-950"
            />

            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Last Name"
              className="rounded-xl border px-4 py-4 text-gray-950"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              type="email"
              placeholder="Email Address"
              className="rounded-xl border px-4 py-4 text-gray-950"
            />

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Phone Number"
              className="rounded-xl border px-4 py-4 text-gray-950"
            />
          </div>

          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Full Address"
            className="w-full rounded-xl border px-4 py-4 text-gray-950"
          />

          <select
            name="membershipType"
            value={formData.membershipType}
            onChange={handleChange}
            required
            className="w-full rounded-xl border px-4 py-4 text-gray-950"
          >
            <option value="">Select Membership Type</option>
            <option>Adults - $50</option>
            <option>Student Member - $30</option>
            <option>Corporate / Partner - $200</option>
            <option>Honorary - $0</option>
          </select>

          <select
            name="memberCategory"
            value={formData.memberCategory}
            onChange={handleChange}
            required
            className="w-full rounded-xl border px-4 py-4 text-gray-950"
          >
            <option value="">Select Member Category</option>
            <option>General Member</option>
            <option>Executive Committee</option>
            <option>Board of Trustees</option>
            <option>Honorary Member</option>
            <option>Corporate Partner</option>
            <option>Student Member</option>
          </select>

          <input
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            placeholder="Emergency Contact"
            className="w-full rounded-xl border px-4 py-4 text-gray-950"
          />

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Upload Photo for Membership ID
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              required
              className="w-full rounded-xl border bg-white px-4 py-4 text-gray-950"
            />
          </div>

          <div className="rounded-2xl border-2 border-yellow-400 bg-yellow-50 p-5">
            <h3 className="mb-2 text-lg font-black text-gray-950">
              Membership Payment
            </h3>

            <p className="text-gray-700">
              Paid memberships will be redirected to secure online payment after
              submitting the application.
            </p>

            <p className="mt-3 text-sm font-bold text-gray-950">
              Honorary membership requires no payment.
            </p>
          </div>

          <label className="flex gap-3 text-sm text-gray-700">
            <input type="checkbox" required className="mt-1" />
            <span>
              I acknowledge and agree to the approved membership terms,
              including the 12-month membership term, non-refundable fees, and
              the Constitution and Bylaws of the Ugandan Society in BC.
            </span>
          </label>

          <label className="flex gap-3 text-sm text-gray-700">
            <input type="checkbox" className="mt-1" />
            <span>
              I consent to receive email updates, newsletters, and event notices
              from USBC.
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gray-950 px-8 py-4 font-bold text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {submitting
              ? "Processing..."
              : "Submit Application & Continue to Payment"}
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
