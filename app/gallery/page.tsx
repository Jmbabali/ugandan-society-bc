"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Album = {
  id: number;
  title: string;
  description: string | null;
  cover_image: string | null;
  event_date: string | null;
  status: string;
};

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    loadAlbums();
  }, []);

  async function loadAlbums() {
    const { data, error } = await supabase
      .from("GalleryAlbums")
      .select("*")
      .eq("status", "Published")
      .order("event_date", { ascending: false });

    if (!error && data) {
      setAlbums(data);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gray-950 px-6 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 font-bold uppercase tracking-widest text-yellow-400">
            Gallery
          </p>

          <h1 className="mb-6 text-4xl font-black md:text-6xl">
            Community Gallery
          </h1>

          <p className="max-w-3xl text-lg text-gray-300">
            Explore USBC community memories, cultural events, celebrations, and
            gatherings across British Columbia.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          {albums.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-premium">
              <h2 className="mb-3 text-3xl font-black text-gray-950">
                No gallery albums yet
              </h2>

              <p className="text-gray-700">
                Published community albums will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {albums.map((album) => (
                <Link
                  key={album.id}
                  href={`/gallery/${album.id}`}
                  className="overflow-hidden rounded-3xl border bg-white shadow-premium transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {album.cover_image ? (
                    <img
                      src={album.cover_image}
                      alt={album.title}
                      className="h-72 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-72 items-center justify-center bg-gray-200 font-bold text-gray-500">
                      No Cover Image
                    </div>
                  )}

                  <div className="p-6">
                    <p className="mb-3 text-sm font-bold uppercase tracking-widest text-red-600">
                      {album.event_date || "Community Album"}
                    </p>

                    <h2 className="mb-3 text-3xl font-black text-gray-950">
                      {album.title}
                    </h2>

                    <p className="text-gray-700">
                      {album.description || "View photos from this USBC album."}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}