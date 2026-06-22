"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function BusinessHubPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  async function fetchBusinesses() {
    const { data, error } = await supabase
      .from("Businesses")
      .select("*")
      .eq("status", "Approved")
      .order("business_name", { ascending: true });

    if (!error && data) {
      setBusinesses(data);
    }
  }

  function getWebsiteUrl(website: string) {
    if (!website) return "";
    return website.startsWith("http") ? website : `https://${website}`;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gray-950 px-6 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 font-bold uppercase tracking-widest text-yellow-400">
            Business Hub
          </p>

          <h1 className="mb-6 text-4xl font-black md:text-6xl">
            Ugandan Businesses in BC
          </h1>

          <p className="max-w-3xl text-lg text-gray-300">
            Discover approved Ugandan-owned businesses, professionals,
            entrepreneurs, and community partners across British Columbia.
          </p>

          <div className="mt-8">
            <Link
              href="/business-hub/submit"
              className="inline-block rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black hover:bg-yellow-300"
            >
              Submit Your Business
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
              Approved Directory
            </p>

            <h2 className="text-3xl font-black text-gray-950 md:text-5xl">
              Business Listings
            </h2>
          </div>

          {businesses.length === 0 ? (
            <div className="rounded-3xl border bg-white p-8 shadow-premium">
              <h3 className="mb-3 text-2xl font-black text-gray-950">
                No approved businesses yet
              </h3>

              <p className="text-gray-700">
                Approved businesses will appear here after review by the USBC
                executive team.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {businesses.map((business) => (
                <div
                  key={business.business_id}
                  className="rounded-3xl border border-gray-100 bg-white p-6 shadow-premium"
                >
                  <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-2xl border bg-gray-50 p-2">
                    {business.logo_url ? (
                      <img
                        src={business.logo_url}
                        alt={`${business.business_name} logo`}
                        className="h-full w-full rounded-xl object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-center text-xs font-bold text-gray-500">
                        No Logo
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-gray-950">
                    {business.business_name}
                  </h3>

                  <p className="mt-2 font-bold text-yellow-600">
                    {business.category}
                  </p>

                  <p className="mt-4 text-gray-600">
                    {business.description}
                  </p>

                  <div className="mt-6 space-y-3 text-gray-700">
                    {business.website && (
                      <p>
                        🌐{" "}
                        <a
                          href={getWebsiteUrl(business.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-blue-600 hover:underline"
                        >
                          Website
                        </a>
                      </p>
                    )}

                    {business.email && (
                      <p>
                        📧{" "}
                        <a
                          href={`mailto:${business.email}`}
                          className="hover:text-gray-950"
                        >
                          {business.email}
                        </a>
                      </p>
                    )}

                    {business.phone && <p>📞 {business.phone}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}