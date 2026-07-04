"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Business = {
  id?: number;
  business_id: string;
  business_name: string;
  owner_name?: string | null;
  category: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  description: string | null;
  location?: string | null;
  status: string;
};

export default function BusinessHubPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchBusinesses();
  }, []);

  async function fetchBusinesses() {
    const { data, error } = await supabase
      .from("Businesses")
      .select("*")
      .eq("status", "Approved")
      .order("business_name", { ascending: true });

    if (!error && data) setBusinesses(data);
  }

  const categories = useMemo(() => {
    const unique = businesses
      .map((b) => b.category)
      .filter(Boolean) as string[];

    return ["All", ...Array.from(new Set(unique))];
  }, [businesses]);

  const filteredBusinesses = businesses.filter((business) => {
    const text = `${business.business_name || ""} ${business.category || ""} ${
      business.location || ""
    } ${business.description || ""}`.toLowerCase();

    return (
      text.includes(search.toLowerCase()) &&
      (category === "All" || business.category === category)
    );
  });

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gray-950 px-6 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 font-bold uppercase tracking-widest text-yellow-400">
            Business Hub
          </p>

          <h1 className="mb-6 text-5xl font-black">
            Ugandan Business Directory
          </h1>

          <p className="max-w-3xl text-lg text-gray-300">
            Discover Ugandan-owned businesses, entrepreneurs and professionals
            serving communities across British Columbia.
          </p>

          <div className="mt-10 flex flex-col gap-4 md:flex-row">
            <input
              type="text"
              placeholder="Search businesses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-xl border border-gray-700 bg-gray-900 px-5 py-4 text-white"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl bg-gray-900 px-5 py-4 text-white"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <Link
              href="/business-hub/submit"
              className="rounded-xl bg-yellow-400 px-8 py-4 text-center font-bold text-black hover:bg-yellow-300"
            >
              + Register Business
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-4xl font-black text-gray-950">
              Business Directory
            </h2>

            <p className="mt-2 text-gray-600">
              {filteredBusinesses.length} approved businesses
            </p>
          </div>

          {filteredBusinesses.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow">
              <h3 className="text-2xl font-black text-gray-950">
                No businesses found
              </h3>

              <p className="mt-3 text-gray-600">
                Try another search or category.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredBusinesses.map((business) => (
                <div
                  key={business.business_id}
                  className="rounded-3xl bg-white p-6 shadow transition hover:shadow-xl"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border bg-gray-50">
                      {business.logo_url ? (
                        <img
                          src={business.logo_url}
                          alt={business.business_name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-500">
                          Logo
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-gray-950">
                        {business.business_name}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-3">
                        {business.category && (
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-800">
                            {business.category}
                          </span>
                        )}

                        {business.location && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                            📍 {business.location}
                          </span>
                        )}
                      </div>

                      <p className="mt-4 text-gray-600">
                        {business.description &&
                        business.description.length > 180
                          ? business.description.substring(0, 180) + "..."
                          : business.description || "No description provided."}
                      </p>
                    </div>

                    <Link
                      href={`/business-hub/${business.business_id}`}
                      className="rounded-xl bg-gray-950 px-7 py-4 text-center font-bold text-white hover:bg-black"
                    >
                      View Profile →
                    </Link>
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