"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }

  function getPaymentAmount(membershipType: string) {
    switch (membershipType) {
      case "Adults - $50":
        return 50;
      case "Student Member - $30":
        return 30;
      case "Corporate / Partner - $200":
        return 200;
      case "Honorary - $0":
        return 0;
      default:
        return 0;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
      payment_status: paymentAmount === 0 ? "Not Required" : "Unpaid",
      payment_amount: paymentAmount,
      payment_method: paymentAmount === 0 ? "Not Required" : null,
      payment_date: null,
      stripe_session_id: null,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "Application submitted successfully. Please complete payment by e-Transfer if applicable."
    );

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
  }

  const membershipTypes = [
    ["Adults", "$50", "One adult member"],
    ["Student Member", "$30", "Full-time student with ID"],
    [
      "Corporate / Partner",
      "$200",
      "Business or organization supporting the mission",
    ],
    ["Honorary", "$0", "Awarded by the Board"],
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gray-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 font-bold uppercase tracking-widest text-yellow-400">
            Membership
          </p>

          <h1 className="mb-6 text-4xl font-black md:text-6xl">
            Join the Ugandan Society in BC
          </h1>

          <p className="max-w-3xl text-lg text-gray-300 md:text-xl">
            Become part of a growing community that preserves Ugandan culture,
            supports members, and builds meaningful connections across British
            Columbia.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
              Approved Membership Categories
            </p>

            <h2 className="mb-4 text-3xl font-black text-gray-950 md:text-5xl">
              Annual Membership Fees
            </h2>

            <p className="text-lg text-gray-700">
              Membership is valid for 12 months from the date of payment.
              Renewal reminders are sent 30 days before expiry. Fees are
              non-refundable under all circumstances.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {membershipTypes.map(([type, fee, desc]) => (
              <div
                key={type}
                className="rounded-3xl border bg-white p-8 shadow-premium"
              >
                <h3 className="mb-3 text-2xl font-black text-gray-950">
                  {type}
                </h3>

                <p className="mb-6 text-gray-700">{desc}</p>

                <p className="mb-8 text-5xl font-black text-gray-950">
                  {fee}
                  <span className="text-base font-normal"> / year</span>
                </p>

                <a
                  href="#application"
                  className="block rounded-xl bg-gray-950 px-6 py-4 text-center font-bold text-white hover:bg-gray-800"
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              Complete the form. Your application will be added to the USBC
              membership database with status set to Pending.
            </p>

            <div className="rounded-3xl bg-gray-950 p-8 text-white shadow-premium">
              <p className="mb-4 font-bold uppercase tracking-widest text-yellow-400">
                Application Process
              </p>

              <div className="space-y-4 text-gray-300">
                <p>1. Submit application</p>
                <p>2. Send membership fee by e-Transfer</p>
                <p>3. USBC confirms payment</p>
                <p>4. USBC reviews and approves application</p>
                <p>5. Official USBC member ID is issued after approval</p>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border-2 border-yellow-400 bg-yellow-50 p-8">
              <h3 className="mb-3 text-2xl font-black text-gray-950">
                E-Transfer Payment Instructions
              </h3>

              <p className="text-gray-700">
                After submitting your application, please send your membership
                fee by Interac e-Transfer to:
              </p>

              <p className="mt-4 break-all text-2xl font-black text-red-600">
                ugandansocietybc@gmail.com
              </p>

              <p className="mt-4 text-gray-700">
                Include your full name and membership type in the transfer
                message so USBC can match your payment to your application.
              </p>

              <p className="mt-4 font-bold text-gray-950">
                Your membership will remain pending until payment is confirmed.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl border bg-gray-50 p-8 shadow-premium md:p-10"
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
                After submitting your application, please send your membership
                fee by Interac e-Transfer to:
              </p>

              <p className="mt-3 break-all text-lg font-black text-red-600">
                ugandansocietybc@gmail.com
              </p>

              <p className="mt-3 text-sm text-gray-700">
                Include your full name and membership type in the transfer
                message.
              </p>

              <p className="mt-3 text-sm font-bold text-gray-950">
                Your membership will remain pending until payment is confirmed.
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
                I consent to receive email updates, newsletters, and event
                notices from USBC.
              </span>
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-gray-950 px-8 py-4 font-bold text-white hover:bg-gray-800"
            >
              Submit Application
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