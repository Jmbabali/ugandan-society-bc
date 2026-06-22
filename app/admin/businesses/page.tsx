"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  async function fetchBusinesses() {
    const { data, error } = await supabase
      .from("Businesses")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBusinesses(data);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-black text-gray-900">
          Business Approvals
        </h1>

        <div className="space-y-6">
          {businesses.map((business) => (
            <div
              key={business.business_id}
              className="rounded-3xl bg-white p-6 shadow-lg"
            >
              <h2 className="text-2xl font-bold">
                {business.business_name}
              </h2>

              <p>
                <strong>Owner:</strong> {business.owner_name}
              </p>

              <p>
                <strong>Category:</strong> {business.category}
              </p>

              <p>
                <strong>Status:</strong> {business.status}
              </p>

              <p>
                <strong>Email:</strong> {business.email}
              </p>

              <p>
                <strong>Phone:</strong> {business.phone}
              </p>

              <p className="mt-3 text-gray-600">
                {business.description}
              </p>

              <div className="mt-6">
                <button
                  onClick={async () => {
                    await supabase
                      .from("Businesses")
                      .update({
                        status: "Approved",
                      })
                      .eq("business_id", business.business_id);

                    fetchBusinesses();
                  }}
                  className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
                >
                  Approve Business
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}