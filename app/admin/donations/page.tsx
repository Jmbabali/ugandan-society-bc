"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminGuard from "@/app/components/AdminGuard";

type Donation = {
  id: number;
  donor_name: string;
  donor_email: string;
  donation_category: string;
  amount: number;
  stripe_session_id: string;
  payment_status: string;
  created_at: string;
};

export default function AdminDonationsPage() {
  const router = useRouter();

  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("usbc_admin_logged_in");

    if (isLoggedIn !== "true") {
      router.push("/admin/login");
      return;
    }

    loadDonations();
  }, [router]);

  async function loadDonations() {
    const { data, error } = await supabase
      .from("Donations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setDonations(data || []);
    setLoading(false);
  }

  const totalAmount = donations.reduce(
    (sum, donation) => sum + Number(donation.amount || 0),
    0
  );

  const paidAmount = donations
    .filter((donation) => donation.payment_status === "Paid")
    .reduce((sum, donation) => sum + Number(donation.amount || 0), 0);

  const pendingAmount = donations
    .filter((donation) => donation.payment_status === "Pending")
    .reduce((sum, donation) => sum + Number(donation.amount || 0), 0);

  if (loading) {
    return (
  <AdminGuard permission="donations">
    <main className="min-h-screen bg-gray-100">
      ...
    </main>
  </AdminGuard>
);
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
            USBC Admin
          </p>

          <h1 className="text-4xl font-black text-gray-950 md:text-6xl">
            Donations
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-gray-700">
            View donation records, categories, payment status, and donation
            totals received through Stripe.
          </p>
        </div>

        {message && (
          <p className="mb-8 rounded-xl bg-yellow-100 p-4 font-bold text-gray-950">
            {message}
          </p>
        )}

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-gray-950 p-6 text-white shadow">
            <p className="text-sm font-bold uppercase text-gray-300">
              Donations
            </p>
            <p className="mt-2 text-4xl font-black">{donations.length}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm font-bold uppercase text-gray-500">
              Total Recorded
            </p>
            <p className="mt-2 text-4xl font-black text-gray-950">
              ${totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="rounded-3xl bg-green-50 p-6 shadow">
            <p className="text-sm font-bold uppercase text-gray-500">
              Paid
            </p>
            <p className="mt-2 text-4xl font-black text-green-700">
              ${paidAmount.toFixed(2)}
            </p>
          </div>

          <div className="rounded-3xl bg-yellow-50 p-6 shadow">
            <p className="text-sm font-bold uppercase text-gray-500">
              Pending
            </p>
            <p className="mt-2 text-4xl font-black text-yellow-700">
              ${pendingAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <section className="rounded-3xl bg-white p-8 shadow-premium">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-3xl font-black text-gray-950">
              Donation Records
            </h2>

            <button
              onClick={loadDonations}
              className="rounded-xl bg-gray-950 px-6 py-4 font-bold text-white hover:bg-gray-800"
            >
              Refresh
            </button>
          </div>

          {donations.length === 0 ? (
            <p className="rounded-2xl bg-gray-100 p-6 text-center font-bold text-gray-700">
              No donations recorded yet.
            </p>
          ) : (
            <div className="grid gap-4">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="rounded-2xl border bg-gray-50 p-5"
                >
                  <div className="grid gap-4 md:grid-cols-6">
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500">
                        Donor
                      </p>
                      <p className="font-black text-gray-950">
                        {donation.donor_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {donation.donor_email}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500">
                        Category
                      </p>
                      <p className="font-bold text-gray-950">
                        {donation.donation_category}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500">
                        Amount
                      </p>
                      <p className="font-black text-green-700">
                        ${Number(donation.amount || 0).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500">
                        Status
                      </p>
                      <p className="font-bold text-gray-950">
                        {donation.payment_status}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500">
                        Date
                      </p>
                      <p className="font-bold text-gray-950">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500">
                        Stripe Session
                      </p>
                      <p className="break-all text-xs text-gray-600">
                        {donation.stripe_session_id}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}