"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function BusinessProfilePage() {
  const params = useParams();
  const businessId = params.business_id as string;

  const [business, setBusiness] = useState<any>(null);

  useEffect(() => {
    loadBusiness();
  }, []);

  async function loadBusiness() {
    const { data } = await supabase
      .from("Businesses")
      .select("*")
      .eq("business_id", businessId)
      .single();

    setBusiness(data);
  }

  if (!business) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Loading Business...</h2>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">

      <section className="bg-gray-950 text-white pt-32 pb-20 px-6">
        <div className="mx-auto max-w-7xl">

          <Link
            href="/business-hub"
            className="text-yellow-400 font-bold"
          >
            ← Back to Directory
          </Link>

          <div className="mt-10 flex flex-col gap-8 lg:flex-row">

            <div className="h-48 w-48 overflow-hidden rounded-3xl bg-white p-5">
              {business.logo_url ? (
                <img
                  src={business.logo_url}
                  alt={business.business_name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  No Logo
                </div>
              )}
            </div>

            <div className="flex-1">

              <h1 className="text-5xl font-black">
                {business.business_name}
              </h1>

              <p className="mt-4 inline-block rounded-full bg-yellow-400 px-4 py-2 font-bold text-black">
                {business.category}
              </p>

              {business.location && (
                <p className="mt-4 text-lg">
                  📍 {business.location}
                </p>
              )}

            </div>

          </div>

        </div>
      </section>

      <section className="px-6 py-16">

        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-3">

          <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow">

            <h2 className="mb-6 text-3xl font-black">
              About
            </h2>

            <p className="leading-8 text-gray-700 whitespace-pre-line">
              {business.description}
            </p>

          </div>

          <div className="rounded-3xl bg-white p-8 shadow">

            <h2 className="mb-6 text-3xl font-black">
              Contact
            </h2>

            {business.website && (
              <a
                href={
                  business.website.startsWith("http")
                    ? business.website
                    : `https://${business.website}`
                }
                target="_blank"
                className="mb-5 block rounded-xl bg-gray-950 px-5 py-4 text-center font-bold text-white"
              >
                Visit Website
              </a>
            )}

            {business.email && (
              <a
                href={`mailto:${business.email}`}
                className="mb-4 block"
              >
                📧 {business.email}
              </a>
            )}

            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className="mb-4 block"
              >
                📞 {business.phone}
              </a>
            )}

            {business.location && (
              <p>
                📍 {business.location}
              </p>
            )}

          </div>

        </div>

      </section>

    </main>
  );
}