"use client";

import { useEffect, useMemo, useState } from "react";
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

const emptyAlbumForm = {
  title: "",
  description: "",
  event_date: "",
  status: "Published",
};

export default function AdminGalleryPage() {
  const router = useRouter();

  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  const [form, setForm] = useState(emptyAlbumForm);
  const [editForm, setEditForm] = useState(emptyAlbumForm);
  const [search, setSearch] = useState("");
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [replacePhotoFile, setReplacePhotoFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

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

  async function refreshAll() {
    await loadAlbums();
    await loadPhotos();
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleEditChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  function openEditAlbum(album: Album) {
    setEditingAlbum(album);
    setEditForm({
      title: album.title || "",
      description: album.description || "",
      event_date: album.event_date || "",
      status: album.status || "Published",
    });
    setMessage("");
  }

  async function createAlbum(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Creating album...");

    const { error } = await supabase.from("GalleryAlbums").insert({
      title: form.title.trim(),
      description: form.description.trim() || null,
      event_date: form.event_date || null,
      status: form.status,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Album created successfully.");
    setForm(emptyAlbumForm);
    setShowCreateForm(false);
    await loadAlbums();
  }

  async function saveAlbum() {
    if (!editingAlbum) return;

    setMessage("Saving album...");

    const { error } = await supabase
      .from("GalleryAlbums")
      .update({
        title: editForm.title.trim(),
        description: editForm.description.trim() || null,
        event_date: editForm.event_date || null,
        status: editForm.status,
      })
      .eq("id", editingAlbum.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Album updated successfully.");
    setEditingAlbum(null);
    await loadAlbums();
  }

  async function uploadPhotos(e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (!selectedAlbum) {
      setMessage("Please open an album first.");
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
      const safeFileName = `album-${selectedAlbum.id}-${Date.now()}-${Math.random()
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
        album_id: selectedAlbum.id,
        photo_url: data.publicUrl,
      });

      if (photoError) {
        setMessage(photoError.message);
        setUploading(false);
        return;
      }
    }

    if (!selectedAlbum.cover_image && uploadedPhotoUrls[0]) {
      await supabase
        .from("GalleryAlbums")
        .update({ cover_image: uploadedPhotoUrls[0] })
        .eq("id", selectedAlbum.id);
    }

    setMessage("Photos uploaded successfully.");
    setUploadFiles(null);
    setUploading(false);
    await refreshAll();
  }

  async function setCoverImage(albumId: number, photoUrl: string) {
    const { error } = await supabase
      .from("GalleryAlbums")
      .update({ cover_image: photoUrl })
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

    setMessage(`Album ${status === "Published" ? "published" : "hidden"}.`);
    await loadAlbums();
  }

  async function deleteAlbum(album: Album) {
    const confirmed = window.confirm(
      `Delete album "${album.title}" and all its photos?`
    );

    if (!confirmed) return;

    const { error: photoError } = await supabase
      .from("GalleryPhotos")
      .delete()
      .eq("album_id", album.id);

    if (photoError) {
      setMessage(photoError.message);
      return;
    }

    const { error } = await supabase
      .from("GalleryAlbums")
      .delete()
      .eq("id", album.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Album deleted.");
    setSelectedAlbum(null);
    await refreshAll();
  }

  async function deletePhoto(photo: Photo) {
    const confirmed = window.confirm("Delete this photo?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("GalleryPhotos")
      .delete()
      .eq("id", photo.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Photo deleted.");
    await loadPhotos();
  }

  async function replacePhoto() {
    if (!editingPhoto || !replacePhotoFile) {
      setMessage("Please choose a replacement photo.");
      return;
    }

    setMessage("Replacing photo...");

    const fileExt = replacePhotoFile.name.split(".").pop() || "jpg";
    const safeFileName = `album-${editingPhoto.album_id}-replace-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery-images")
      .upload(safeFileName, replacePhotoFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      setMessage(uploadError.message);
      return;
    }

    const { data } = supabase.storage
      .from("gallery-images")
      .getPublicUrl(safeFileName);

    const { error } = await supabase
      .from("GalleryPhotos")
      .update({ photo_url: data.publicUrl })
      .eq("id", editingPhoto.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Photo replaced successfully.");
    setEditingPhoto(null);
    setReplacePhotoFile(null);
    await loadPhotos();
  }

  const publishedAlbums = albums.filter((album) => album.status === "Published");
  const hiddenAlbums = albums.filter((album) => album.status === "Hidden");

  const filteredAlbums = useMemo(() => {
    const s = search.toLowerCase();
    return albums.filter((album) => {
      return (
        album.title?.toLowerCase().includes(s) ||
        album.description?.toLowerCase().includes(s) ||
        album.status?.toLowerCase().includes(s)
      );
    });
  }, [albums, search]);

  const selectedAlbumPhotos = selectedAlbum
    ? photos.filter((photo) => photo.album_id === selectedAlbum.id)
    : [];

  const selectedAlbumFresh = selectedAlbum
    ? albums.find((album) => album.id === selectedAlbum.id) || selectedAlbum
    : null;

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
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
              USBC Admin
            </p>

            <h1 className="text-4xl font-black text-gray-950 md:text-6xl">
              Gallery Management
            </h1>

            <p className="mt-4 max-w-3xl text-lg text-gray-700">
              Create albums, upload event photos, set cover images, and manage
              what appears on the public gallery.
            </p>
          </div>

          {!selectedAlbum && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="rounded-xl bg-gray-950 px-6 py-4 font-bold text-white hover:bg-gray-800"
            >
              {showCreateForm ? "Close Form" : "+ Create Album"}
            </button>
          )}
        </div>

        {message && (
          <p className="mb-8 rounded-xl bg-yellow-100 p-4 font-bold text-gray-950">
            {message}
          </p>
        )}

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          <StatCard title="Albums" value={albums.length} color="dark" />
          <StatCard title="Photos" value={photos.length} color="gray" />
          <StatCard title="Published" value={publishedAlbums.length} color="green" />
          <StatCard title="Hidden" value={hiddenAlbums.length} color="yellow" />
        </div>

        {!selectedAlbum && showCreateForm && (
          <form
            onSubmit={createAlbum}
            className="mb-10 rounded-3xl border bg-white p-8 shadow-premium"
          >
            <h2 className="mb-6 text-3xl font-black text-gray-950">
              Create Album
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Album Title"
                className="rounded-xl border px-4 py-4 text-gray-950"
              />

              <input
                type="date"
                name="event_date"
                value={form.event_date}
                onChange={handleChange}
                className="rounded-xl border px-4 py-4 text-gray-950"
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="rounded-xl border px-4 py-4 text-gray-950 md:col-span-2"
              >
                <option>Published</option>
                <option>Hidden</option>
              </select>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Album Description"
                className="h-32 rounded-xl border px-4 py-4 text-gray-950 md:col-span-2"
              />
            </div>

            <button
              type="submit"
              className="mt-6 rounded-xl bg-gray-950 px-8 py-4 font-bold text-white hover:bg-gray-800"
            >
              Create Album
            </button>
          </form>
        )}

        {!selectedAlbum ? (
          <section>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-3xl font-black text-gray-950">Albums</h2>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search albums..."
                className="w-full rounded-xl border bg-white px-4 py-4 text-gray-950 md:w-96"
              />
            </div>

            <div className="grid gap-5">
              {filteredAlbums.map((album) => {
                const albumPhotos = photos.filter(
                  (photo) => photo.album_id === album.id
                );

                return (
                  <div
                    key={album.id}
                    className="rounded-3xl border bg-white p-6 shadow-premium"
                  >
                    <div className="grid gap-6 md:grid-cols-[180px_1fr] md:items-center">
                      <div>
                        {album.cover_image ? (
                          <img
                            src={album.cover_image}
                            alt={album.title}
                            className="h-40 w-full rounded-3xl object-cover"
                          />
                        ) : (
                          <div className="flex h-40 w-full items-center justify-center rounded-3xl bg-gray-100 text-5xl">
                            📁
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-red-600">
                              {album.status}
                            </p>

                            <h3 className="text-3xl font-black text-gray-950">
                              {album.title}
                            </h3>

                            <p className="mt-2 text-gray-700">
                              {album.description || "No description provided."}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-gray-600">
                              <span>📅 {album.event_date || "No date"}</span>
                              <span>📷 {albumPhotos.length} Photos</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3 md:justify-end">
                            <button
                              onClick={() => setSelectedAlbum(album)}
                              className="rounded-xl bg-gray-950 px-5 py-3 font-bold text-white hover:bg-gray-800"
                            >
                              Open Album
                            </button>

                            <button
                              onClick={() => openEditAlbum(album)}
                              className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black hover:bg-yellow-300"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteAlbum(album)}
                              className="rounded-xl bg-red-700 px-5 py-3 font-bold text-white hover:bg-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredAlbums.length === 0 && (
                <p className="rounded-3xl bg-white p-8 text-center font-bold text-gray-700">
                  No albums found.
                </p>
              )}
            </div>
          </section>
        ) : (
          <section>
            <button
              onClick={() => {
                setSelectedAlbum(null);
                setUploadFiles(null);
              }}
              className="mb-6 rounded-xl bg-white px-5 py-3 font-bold text-gray-950 shadow hover:bg-yellow-50"
            >
              ← Back to Albums
            </button>

            <div className="mb-8 rounded-3xl bg-white p-8 shadow-premium">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="mb-3 font-bold uppercase tracking-widest text-red-600">
                    {selectedAlbumFresh?.status}
                  </p>

                  <h2 className="text-4xl font-black text-gray-950">
                    {selectedAlbumFresh?.title}
                  </h2>

                  <p className="mt-3 max-w-3xl text-gray-700">
                    {selectedAlbumFresh?.description || "No description provided."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 font-bold text-gray-600">
                    <span>📅 {selectedAlbumFresh?.event_date || "No date"}</span>
                    <span>📷 {selectedAlbumPhotos.length} Photos</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => openEditAlbum(selectedAlbumFresh || selectedAlbum)}
                    className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black"
                  >
                    Edit Album
                  </button>

                  <button
                    onClick={() =>
                      updateAlbumStatus(
                        selectedAlbum.id,
                        selectedAlbumFresh?.status === "Published"
                          ? "Hidden"
                          : "Published"
                      )
                    }
                    className="rounded-xl bg-green-700 px-5 py-3 font-bold text-white"
                  >
                    {selectedAlbumFresh?.status === "Published" ? "Hide" : "Publish"}
                  </button>

                  <button
                    onClick={() => deleteAlbum(selectedAlbumFresh || selectedAlbum)}
                    className="rounded-xl bg-red-700 px-5 py-3 font-bold text-white"
                  >
                    Delete Album
                  </button>
                </div>
              </div>
            </div>

            <form
              onSubmit={uploadPhotos}
              className="mb-8 rounded-3xl border bg-white p-8 shadow-premium"
            >
              <h3 className="mb-5 text-2xl font-black text-gray-950">
                Upload Photos to This Album
              </h3>

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

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {selectedAlbumPhotos.map((photo) => (
                <div key={photo.id} className="rounded-3xl bg-white p-4 shadow">
                  <img
                    src={photo.photo_url}
                    alt={selectedAlbum.title}
                    className="h-44 w-full rounded-2xl object-cover"
                  />

                  <div className="mt-4 grid gap-2">
                    <button
                      onClick={() => setCoverImage(selectedAlbum.id, photo.photo_url)}
                      className="rounded-xl bg-gray-950 px-4 py-3 text-sm font-bold text-white"
                    >
                      Set as Cover
                    </button>

                    <button
                      onClick={() => {
                        setEditingPhoto(photo);
                        setReplacePhotoFile(null);
                      }}
                      className="rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-black"
                    >
                      Edit Photo
                    </button>

                    <button
                      onClick={() => deletePhoto(photo)}
                      className="rounded-xl bg-red-700 px-4 py-3 text-sm font-bold text-white"
                    >
                      Delete Photo
                    </button>
                  </div>
                </div>
              ))}

              {selectedAlbumPhotos.length === 0 && (
                <p className="rounded-3xl bg-white p-8 text-center font-bold text-gray-700 sm:col-span-2 lg:col-span-4">
                  No photos in this album yet.
                </p>
              )}
            </div>
          </section>
        )}
      </div>

      {editingAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="mb-6 text-3xl font-black text-gray-950">
              Edit Album
            </h2>

            <div className="grid gap-4">
              <input
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                required
                placeholder="Album Title"
                className="rounded-xl border px-4 py-4 text-gray-950"
              />

              <input
                type="date"
                name="event_date"
                value={editForm.event_date}
                onChange={handleEditChange}
                className="rounded-xl border px-4 py-4 text-gray-950"
              />

              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                className="rounded-xl border px-4 py-4 text-gray-950"
              >
                <option>Published</option>
                <option>Hidden</option>
              </select>

              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                placeholder="Album Description"
                className="h-36 rounded-xl border px-4 py-4 text-gray-950"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={saveAlbum}
                className="flex-1 rounded-xl bg-green-700 px-6 py-4 font-bold text-white"
              >
                Save Changes
              </button>

              <button
                onClick={() => setEditingAlbum(null)}
                className="flex-1 rounded-xl bg-gray-200 px-6 py-4 font-bold text-gray-950"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="mb-6 text-3xl font-black text-gray-950">
              Edit Photo
            </h2>

            <img
              src={editingPhoto.photo_url}
              alt="Gallery photo"
              className="mb-5 h-64 w-full rounded-3xl object-cover"
            />

            <label className="mb-2 block font-bold text-gray-700">
              Replace Photo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setReplacePhotoFile(e.target.files?.[0] || null)}
              className="w-full rounded-xl border px-4 py-4 text-gray-950"
            />

            <div className="mt-6 flex gap-3">
              <button
                onClick={replacePhoto}
                className="flex-1 rounded-xl bg-green-700 px-6 py-4 font-bold text-white"
              >
                Save Photo
              </button>

              <button
                onClick={() => {
                  setEditingPhoto(null);
                  setReplacePhotoFile(null);
                }}
                className="flex-1 rounded-xl bg-gray-200 px-6 py-4 font-bold text-gray-950"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: "dark" | "gray" | "green" | "yellow";
}) {
  const styles: Record<string, string> = {
    dark: "bg-gray-950 text-white",
    gray: "bg-white text-gray-950",
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
  };

  return (
    <div className={`rounded-3xl p-6 shadow ${styles[color]}`}>
      <p className="text-sm font-bold uppercase opacity-70">{title}</p>
      <p className="mt-2 text-4xl font-black">{value}</p>
    </div>
  );
}
