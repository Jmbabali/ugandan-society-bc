"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminNav from "@/app/components/AdminNav";

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

export default function AdminRenewalsPage() {
  const router = useRouter();

  const [renewals, setRenewals] = useState<RenewalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("usbc_admin_logged_in");

    if (isLoggedIn !== "true") {
      router.push("/admin/login");
      return;
    }

    loadRenewals();
  }, [router]);

  async function loadRenewals() {
    const { data, error } = await supabase
      .from("RenewalRequests")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setRenewals(data || []);
    setLoading(false);
  }

  async function markPaid(id: number) {
    const { error } = await supabase
      .from("RenewalRequests")
      .update({
        payment_status: "Paid",
        payment_date: new Date().toISOString(),
      })
      .eq("id", id);

    if (!error) {
      loadRenewals();
    }
  }

  async function approveRenewal(request: RenewalRequest) {
    const currentExpiry = new Date(request.current_expiry_date);

    const newExpiry = new Date(currentExpiry);
    newExpiry.setFullYear(newExpiry.getFullYear() + 1);

    const { error: memberError } = await supabase
      .from("Members")
      .update({
        expiry_date: newExpiry.toISOString().split("T")[0],
      })
      .eq("member_id", request.member_id);

    if (memberError) {
      setMessage(memberError.message);
      return;
    }

    const { error } = await supabase
      .from("RenewalRequests")
      .update({
        status: "Approved",
        approved_at: new Date().toISOString(),
      })
      .eq("id", request.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Renewal approved successfully.");
    loadRenewals();
  }

  async function rejectRenewal(id: number) {
    const { error } = await supabase
      .from("RenewalRequests")
      .update({
        status: "Rejected",
      })
      .eq("id", id);

    if (!error) {
      loadRenewals();
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-bold">Loading renewals...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <AdminNav />

        <div className="mb-10">
          <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
            USBC Admin
          </p>

          <h1 className="text-5xl font-black text-gray-950">
            Membership Renewals
          </h1>
        </div>

        {message && (
          <div className="mb-6 rounded-xl bg-yellow-100 p-4 font-bold">
            {message}
          </div>
        )}

        <div className="grid gap-6">
          {renewals.map((renewal) => (
            <div
              key={renewal.id}
              className="rounded-3xl bg-white p-8 shadow"
            >
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm uppercase text-gray-500">
                    Member
                  </p>

                  <p className="font-black">
                    {renewal.member_name}
                  </p>

                  <p>{renewal.member_email}</p>
                </div>

                <div>
                  <p className="text-sm uppercase text-gray-500">
                    Membership
                  </p>

                  <p>{renewal.membership_type}</p>

                  <p>
                    Current Expiry:{" "}
                    {renewal.current_expiry_date}
                  </p>
                </div>

                <div>
                  <p className="text-sm uppercase text-gray-500">
                    Status
                  </p>

                  <p>
                    Renewal: {renewal.status}
                  </p>

                  <p>
                    Payment: {renewal.payment_status}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => markPaid(renewal.id)}
                  className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white"
                >
                  Mark Paid
                </button>

                <button
                  onClick={() => approveRenewal(renewal)}
                  className="rounded-xl bg-gray-950 px-5 py-3 font-bold text-white"
                >
                  Approve Renewal
                </button>

                <button
                  onClick={() => rejectRenewal(renewal.id)}
                  className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}