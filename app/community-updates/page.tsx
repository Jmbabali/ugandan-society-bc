"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Update = {
  id: number;
  title: string;
  message: string;
  status: string;
  created_at: string;
};

export default function CommunityUpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUpdates();
  }, []);

  async function loadUpdates() {
    const { data, error } = await supabase
      .from("CommunityUpdates")
      .select("*")
      .eq("status", "Published")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUpdates(data);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gray-950 px-6 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 font-bold uppercase tracking-widest text-yellow-400">
            Community Updates
          </p>

          <h1 className="mb-6 text-4xl font-black md:text-6xl">
            Community Updates
          </h1>

          <p className="max-w-3xl text-lg text-gray-300">
            Stay informed about community announcements, event notices,
            opportunities, and important updates from the Ugandan Society in BC.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          {loading ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-premium">
              <p className="font-bold text-gray-700">
                Loading updates...
              </p>
            </div>
          ) : updates.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-premium">
              <h2 className="mb-3 text-3xl font-black text-gray-950">
                No updates available
              </h2>

              <p className="text-gray-700">
                Community updates will appear here when published.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {updates.map((update) => (
                <article
                  key={update.id}
                  className="rounded-3xl border bg-white p-8 shadow-premium"
                >
                  <p className="mb-3 text-sm font-bold uppercase tracking-widest text-red-600">
                    {new Date(update.created_at).toLocaleDateString()}
                  </p>

                  <h2 className="mb-4 text-3xl font-black text-gray-950">
                    {update.title}
                  </h2>

                  <p className="whitespace-pre-line text-lg text-gray-700">
                    {update.message}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}