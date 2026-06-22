"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

type Photo = {
  id: number;
  album_id: number;
  photo_url: string;
};

export default function GalleryAlbumPage() {
  const params = useParams();
  const albumId = Number(params.id);

  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    loadAlbum();
    loadPhotos();
  }, []);

  async function loadAlbum() {
    const { data } = await supabase
      .from("GalleryAlbums")
      .select("*")
      .eq("id", albumId)
      .single();

    setAlbum(data);
  }

  async function loadPhotos() {
    const { data } = await supabase
      .from("GalleryPhotos")
      .select("*")
      .eq("album_id", albumId)
      .order("created_at", { ascending: true });

    setPhotos(data || []);
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gray-950 px-6 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 font-bold uppercase tracking-widest text-yellow-400">
            Gallery Album
          </p>

          <h1 className="mb-6 text-4xl font-black md:text-6xl">
            {album?.title || "Gallery Album"}
          </h1>

          <p className="max-w-3xl text-lg text-gray-300">
            {album?.description || "USBC community photos and memories."}
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/gallery"
            className="mb-8 inline-block rounded-xl bg-gray-950 px-6 py-4 font-bold text-white"
          >
            ← Back to Gallery
          </Link>

          {photos.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-premium">
              <h2 className="mb-3 text-3xl font-black text-gray-950">
                No photos yet
              </h2>

              <p className="text-gray-700">
                Photos for this album will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
                <a
                  key={photo.id}
                  href={photo.photo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="overflow-hidden rounded-3xl bg-white shadow-premium"
                >
                  <img
                    src={photo.photo_url}
                    alt={album?.title || "Gallery photo"}
                    className="h-80 w-full object-cover transition hover:scale-105"
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}