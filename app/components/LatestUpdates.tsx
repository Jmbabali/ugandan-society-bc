"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Update = {
  id: number;
  title: string;
  message: string;
  created_at: string;
  status: string;
};

function shortText(text: string, maxLength = 200) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

export default function LatestUpdates() {
  const [updates, setUpdates] = useState<Update[]>([]);

  useEffect(() => {
    async function loadUpdates() {
      const { data, error } = await supabase
        .from("CommunityUpdates")
        .select("id, title, message, created_at, status")
        .eq("status", "Published")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Community updates error:", error.message);
        return;
      }

      setUpdates(data || []);
    }

    loadUpdates();
  }, []);

  if (updates.length === 0) {
    return (
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl text-center">
          <p className="font-black text-red-600">
            No published community updates found.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-4 font-black uppercase tracking-[0.3em] text-red-600">
            Latest Community Updates
          </p>

          <h2 className="mb-6 text-4xl font-black text-gray-950 md:text-5xl">
            Stay Connected with USBC
          </h2>

          <p className="text-lg leading-8 text-gray-600">
            Follow the latest announcements, community news, event notices, and
            important updates from the Ugandan Society in BC.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {updates.map((update) => (
            <Link
              key={update.id}
              href="/community-updates"
              className="rounded-3xl border bg-white p-8 shadow-md transition hover:-translate-y-2 hover:border-yellow-400 hover:shadow-2xl"
            >
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-red-600">
                {new Date(update.created_at).toLocaleDateString()}
              </p>

              <h3 className="mb-4 text-2xl font-black text-gray-950">
                {update.title}
              </h3>

              <p className="mb-6 leading-7 text-gray-600">
                {shortText(update.message, 200)}
              </p>

              <span className="font-black text-red-600">Read More →</span>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/community-updates"
            className="inline-block rounded-xl bg-gray-950 px-8 py-4 font-black text-white transition hover:bg-gray-800"
          >
            View All Updates
          </Link>
        </div>
      </div>
    </section>
  );
}