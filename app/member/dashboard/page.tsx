"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Member = {
  member_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  emergency_contact: string;
  membership_type: string;
  status: string;
  payment_status: string;
  payment_amount: number;
  issue_date: string;
  expiry_date: string;
};

type RenewalRequest = {
  id: number;
  member_id: string;
  member_name: string;
  member_email: string;
  membership_type: string;
  current_expiry_date: string;
  requested_at: string;
  status: string;
  payment_status: string;
  payment_method: string;
  payment_date: string | null;
  approved_at: string | null;
  notes: string | null;
};

export default function MemberDashboardPage() {
  const router = useRouter();

  const [member, setMember] = useState<Member | null>(null);
  const [renewalRequest, setRenewalRequest] =
    useState<RenewalRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadMember() {
      const stored = localStorage.getItem("usbc_member");

      if (!stored) {
        router.push("/login");
        return;
      }

      const session = JSON.parse(stored);

      const { data, error } = await supabase
        .from("Members")
        .select("*")
        .eq("member_id", session.member_id)
        .eq("email", session.email)
        .single();

      if (error || !data) {
        router.push("/login");
        return;
      }

      setMember(data);

      const { data: renewalData } = await supabase
        .from("RenewalRequests")
        .select("*")
        .eq("member_id", data.member_id)
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

      setRenewalRequest(renewalData || null);
      setLoading(false);
    }

    loadMember();
  }, [router]);

  function getRenewalAmount(membershipType: string) {
    if (membershipType === "Adults - $50") return 50;
    if (membershipType === "Student Member - $30") return 30;
    if (membershipType === "Corporate / Partner - $200") return 200;
    if (membershipType === "Honorary - $0") return 0;
    return 0;
  }

  async function requestRenewal() {
    if (!member) return;

    if (renewalRequest && renewalRequest.status === "Pending") {
      setMessage("You already have a pending renewal request.");
      return;
    }

    const confirmed = window.confirm(
      "Submit a membership renewal request?"
    );

    if (!confirmed) return;

    setMessage("Submitting renewal request...");

    const { error } = await supabase.from("RenewalRequests").insert({
      member_id: member.member_id,
      member_name: `${member.first_name} ${member.last_name}`,
      member_email: member.email,
      membership_type: member.membership_type,
      current_expiry_date: member.expiry_date,
      requested_at: new Date().toISOString(),
      status: "Pending",
      payment_status:
        getRenewalAmount(member.membership_type) === 0
          ? "Not Required"
          : "Unpaid",
      payment_method:
        getRenewalAmount(member.membership_type) === 0
          ? "Not Required"
          : "E-Transfer",
      payment_date: null,
      approved_at: null,
      notes: null,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "Renewal request submitted successfully. Please send your renewal payment by e-Transfer if applicable."
    );

    const { data: renewalData } = await supabase
      .from("RenewalRequests")
      .select("*")
      .eq("member_id", member.member_id)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    setRenewalRequest(renewalData || null);
  }

  async function saveProfile() {
    if (!member) return;

    setMessage("Saving profile...");

    const { error } = await supabase
      .from("Members")
      .update({
        phone: member.phone,
        address: member.address,
        emergency_contact: member.emergency_contact,
      })
      .eq("member_id", member.member_id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Profile updated successfully.");
  }

  function logout() {
    localStorage.removeItem("usbc_member");
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="rounded-3xl bg-white p-8 font-bold shadow-xl">
          Loading Member Portal...
        </p>
      </main>
    );
  }

  if (!member) return null;

  const renewalAmount = getRenewalAmount(member.membership_type);

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="mb-2 font-bold uppercase tracking-widest text-red-600">
              USBC Member Area
            </p>

            <h1 className="text-5xl font-black text-gray-950">
              Member Portal
            </h1>
          </div>

          <button
            onClick={logout}
            className="rounded-xl bg-red-600 px-6 py-4 font-bold text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm font-bold uppercase text-gray-500">Status</p>
            <p className="text-2xl font-black text-gray-950">
              {member.status}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm font-bold uppercase text-gray-500">Payment</p>
            <p className="text-2xl font-black text-gray-950">
              {member.payment_status}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm font-bold uppercase text-gray-500">Issued</p>
            <p className="font-black text-gray-950">{member.issue_date}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm font-bold uppercase text-gray-500">Expires</p>
            <p className="font-black text-gray-950">{member.expiry_date}</p>
          </div>
        </div>

        {message && (
          <p className="mb-8 rounded-xl bg-yellow-100 p-4 font-bold text-gray-950">
            {message}
          </p>
        )}

        <div className="mb-8 rounded-3xl bg-white p-8 shadow">
          <h2 className="mb-6 text-3xl font-black text-gray-950">
            Membership Card
          </h2>

          <a
            href={`/member-card/${member.member_id}`}
            target="_blank"
            className="inline-block rounded-xl bg-gray-950 px-6 py-4 font-bold text-white hover:bg-gray-800"
          >
            View Membership Card
          </a>
        </div>

        <div className="mb-8 rounded-3xl border-2 border-yellow-400 bg-yellow-50 p-8 shadow">
          <h2 className="mb-4 text-3xl font-black text-gray-950">
            Membership Renewal
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase text-gray-500">
                Membership Type
              </p>
              <p className="text-xl font-black text-gray-950">
                {member.membership_type}
              </p>
            </div>

            <div>
              <p className="text-sm font-bold uppercase text-gray-500">
                Renewal Fee
              </p>
              <p className="text-xl font-black text-gray-950">
                ${renewalAmount}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-5">
            <p className="font-bold text-gray-950">
              E-Transfer Payment Instructions
            </p>

            <p className="mt-2 text-gray-700">
              Send renewal payment to:
            </p>

            <p className="mt-2 break-all text-lg font-black text-red-600">
              ugandansocietybc@gmail.com
            </p>

            <p className="mt-2 text-sm text-gray-700">
              Include your full name and Member ID in the transfer message.
            </p>
          </div>

          {renewalRequest ? (
            <div className="mt-6 rounded-2xl bg-white p-5">
              <p className="text-sm font-bold uppercase text-gray-500">
                Latest Renewal Request
              </p>

              <p className="mt-2 font-black text-gray-950">
                Status: {renewalRequest.status}
              </p>

              <p className="text-gray-700">
                Payment: {renewalRequest.payment_status}
              </p>

              <p className="text-gray-700">
                Requested:{" "}
                {new Date(renewalRequest.requested_at).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="mt-6 text-gray-700">
              You have no renewal request on file.
            </p>
          )}

          <button
            onClick={requestRenewal}
            className="mt-6 rounded-xl bg-gray-950 px-6 py-4 font-bold text-white hover:bg-gray-800"
          >
            Request Membership Renewal
          </button>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow">
          <h2 className="mb-6 text-3xl font-black text-gray-950">
            Update Profile
          </h2>

          <div className="grid gap-4">
            <input
              value={member.phone || ""}
              onChange={(e) =>
                setMember({
                  ...member,
                  phone: e.target.value,
                })
              }
              placeholder="Phone"
              className="rounded-xl border px-4 py-4 text-gray-950"
            />

            <input
              value={member.address || ""}
              onChange={(e) =>
                setMember({
                  ...member,
                  address: e.target.value,
                })
              }
              placeholder="Address"
              className="rounded-xl border px-4 py-4 text-gray-950"
            />

            <input
              value={member.emergency_contact || ""}
              onChange={(e) =>
                setMember({
                  ...member,
                  emergency_contact: e.target.value,
                })
              }
              placeholder="Emergency Contact"
              className="rounded-xl border px-4 py-4 text-gray-950"
            />

            <button
              onClick={saveProfile}
              className="rounded-xl bg-gray-950 px-6 py-4 font-bold text-white hover:bg-gray-800"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}