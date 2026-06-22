"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Album = {
  id: number;
  title: string;
  description: string | null;
  cover_image: string | null;
  event_date: string | null;
  status: string;
  created_at: string;
};

type Photo = {
  id: number;
  album_id: number;
  photo_url: string;
  created_at: string;
};

export default function AdminGalleryPage() {
  const router = useRouter();

  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [message, setMessage] = useState("");
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    status: "Published",
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("usbc_admin_logged_in");

    if (isLoggedIn !== "true") {
      router.push("/admin/login");
      return;
    }

    setCheckingLogin(false);
    loadAlbums();
    loadPhotos();
  }, [router]);

  async function loadAlbums() {
    const { data, error } = await supabase
      .from("GalleryAlbums")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setAlbums(data || []);
  }

  async function loadPhotos() {
    const { data, error } = await supabase
      .from("GalleryPhotos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setPhotos(data || []);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function createAlbum(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Creating album...");

    const { error } = await supabase.from("GalleryAlbums").insert({
      title: form.title,
      description: form.description,
      event_date: form.event_date || null,
      status: form.status,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Album created successfully.");

    setForm({
      title: "",
      description: "",
      event_date: "",
      status: "Published",
    });

    await loadAlbums();
  }

  async function uploadPhotos(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedAlbumId) {
      setMessage("Please select an album first.");
      return;
    }

    if (!uploadFiles || uploadFiles.length === 0) {
      setMessage("Please choose at least one photo.");
      return;
    }

    setUploading(true);
    setMessage("Uploading photos...");

    const uploadedPhotoUrls: string[] = [];

    for (const file of Array.from(uploadFiles)) {
      const fileExt = file.name.split(".").pop() || "jpg";
      const safeFileName = `album-${selectedAlbumId}-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery-images")
        .upload(safeFileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setMessage(uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from("gallery-images")
        .getPublicUrl(safeFileName);

      uploadedPhotoUrls.push(data.publicUrl);

      const { error: photoError } = await supabase.from("GalleryPhotos").insert({
        album_id: Number(selectedAlbumId),
        photo_url: data.publicUrl,
      });

      if (photoError) {
        setMessage(photoError.message);
        setUploading(false);
        return;
      }
    }

    const selectedAlbum = albums.find(
      (album) => album.id === Number(selectedAlbumId)
    );

    if (selectedAlbum && !selectedAlbum.cover_image && uploadedPhotoUrls[0]) {
      await supabase
        .from("GalleryAlbums")
        .update({
          cover_image: uploadedPhotoUrls[0],
        })
        .eq("id", Number(selectedAlbumId));
    }

    setMessage("Photos uploaded successfully.");
    setUploadFiles(null);
    setUploading(false);

    await loadAlbums();
    await loadPhotos();
  }

  async function setCoverImage(albumId: number, photoUrl: string) {
    const { error } = await supabase
      .from("GalleryAlbums")
      .update({
        cover_image: photoUrl,
      })
      .eq("id", albumId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Cover image updated.");
    await loadAlbums();
  }

  async function updateAlbumStatus(albumId: number, status: string) {
    const { error } = await supabase
      .from("GalleryAlbums")
      .update({ status })
      .eq("id", albumId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Album status updated.");
    await loadAlbums();
  }

  async function deleteAlbum(album: Album) {
    const confirmed = window.confirm(
      `Delete album "${album.title}" and all its photos?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("GalleryAlbums")
      .delete()
      .eq("id", album.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Album deleted.");
    await loadAlbums();
    await loadPhotos();
  }

  const publishedAlbums = albums.filter((album) => album.status === "Published");
  const hiddenAlbums = albums.filter((album) => album.status === "Hidden");

  if (checkingLogin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
        <p className="rounded-3xl bg-white p-8 font-bold text-gray-950 shadow-xl">
          Checking admin access...
        </p>
      </main>
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
            Gallery Management
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-gray-700">
            Create community photo albums, upload event photos, set cover
            images, and manage what appears on the public gallery.
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
              Albums
            </p>
            <p className="mt-2 text-4xl font-black">{albums.length}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm font-bold uppercase text-gray-500">
              Photos
            </p>
            <p className="mt-2 text-4xl font-black">{photos.length}</p>
          </div>

          <div className="rounded-3xl bg-green-50 p-6 shadow">
            <p className="text-sm font-bold uppercase text-gray-500">
              Published
            </p>
            <p className="mt-2 text-4xl font-black text-green-700">
              {publishedAlbums.length}
            </p>
          </div>

          <div className="rounded-3xl bg-yellow-50 p-6 shadow">
            <p className="text-sm font-bold uppercase text-gray-500">
              Hidden
            </p>
            <p className="mt-2 text-4xl font-black text-yellow-700">
              {hiddenAlbums.length}
            </p>
          </div>
        </div>

        <div className="mb-10 grid gap-8 lg:grid-cols-2">
          <form
            onSubmit={createAlbum}
            className="rounded-3xl border bg-white p-8 shadow-premium"
          >
            <h2 className="mb-6 text-3xl font-black text-gray-950">
              Create Album
            </h2>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Album Title"
              className="mb-4 w-full rounded-xl border px-4 py-4 text-gray-950"
            />

            <input
              type="date"
              name="event_date"
              value={form.event_date}
              onChange={handleChange}
              className="mb-4 w-full rounded-xl border px-4 py-4 text-gray-950"
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mb-4 w-full rounded-xl border px-4 py-4 text-gray-950"
            >
              <option>Published</option>
              <option>Hidden</option>
            </select>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Album Description"
              className="mb-4 h-32 w-full rounded-xl border px-4 py-4 text-gray-950"
            />

            <button
              type="submit"
              className="rounded-xl bg-gray-950 px-8 py-4 font-bold text-white hover:bg-gray-800"
            >
              Create Album
            </button>
          </form>

          <form
            onSubmit={uploadPhotos}
            className="rounded-3xl border bg-white p-8 shadow-premium"
          >
            <h2 className="mb-6 text-3xl font-black text-gray-950">
              Upload Photos
            </h2>

            <select
              value={selectedAlbumId}
              onChange={(e) => setSelectedAlbumId(e.target.value)}
              required
              className="mb-4 w-full rounded-xl border px-4 py-4 text-gray-950"
            >
              <option value="">Select Album</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))}
            </select>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setUploadFiles(e.target.files)}
              className="mb-4 w-full rounded-xl border bg-white px-4 py-4 text-gray-950"
            />

            <button
              type="submit"
              disabled={uploading}
              className="rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black hover:bg-yellow-300 disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload Photos"}
            </button>
          </form>
        </div>

        <section>
          <h2 className="mb-6 text-3xl font-black text-gray-950">
            Albums
          </h2>

          <div className="grid gap-8">
            {albums.map((album) => {
              const albumPhotos = photos.filter(
                (photo) => photo.album_id === album.id
              );

              return (
                <div
                  key={album.id}
                  className="rounded-3xl border bg-white p-8 shadow-premium"
                >
                  <div className="grid gap-8 lg:grid-cols-3">
                    <div>
                      {album.cover_image ? (
                        <img
                          src={album.cover_image}
                          alt={album.title}
                          className="h-64 w-full rounded-3xl object-cover"
                        />
                      ) : (
                        <div className="flex h-64 w-full items-center justify-center rounded-3xl bg-gray-100 font-bold text-gray-500">
                          No Cover
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-2">
                      <p className="mb-2 text-sm font-bold uppercase tracking-widest text-red-600">
                        {album.status}
                      </p>

                      <h3 className="text-3xl font-black text-gray-950">
                        {album.title}
                      </h3>

                      <p className="mt-2 text-gray-700">
                        {album.description || "No description provided."}
                      </p>

                      <p className="mt-3 text-gray-600">
                        Date: {album.event_date || "Not specified"}
                      </p>

                      <p className="mt-3 font-bold text-gray-950">
                        Photos: {albumPhotos.length}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          onClick={() => updateAlbumStatus(album.id, "Published")}
                          className="rounded-xl bg-green-700 px-5 py-3 font-bold text-white"
                        >
                          Publish
                        </button>

                        <button
                          onClick={() => updateAlbumStatus(album.id, "Hidden")}
                          className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black"
                        >
                          Hide
                        </button>

                        <button
                          onClick={() => deleteAlbum(album)}
                          className="rounded-xl bg-red-700 px-5 py-3 font-bold text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {albumPhotos.length > 0 && (
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                      {albumPhotos.map((photo) => (
                        <div key={photo.id}>
                          <img
                            src={photo.photo_url}
                            alt={album.title}
                            className="h-40 w-full rounded-2xl object-cover"
                          />

                          <button
                            onClick={() =>
                              setCoverImage(album.id, photo.photo_url)
                            }
                            className="mt-2 w-full rounded-xl bg-gray-950 px-4 py-2 text-sm font-bold text-white"
                          >
                            Set as Cover
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {albums.length === 0 && (
              <p className="rounded-3xl bg-white p-8 text-center font-bold text-gray-700">
                No albums created yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}