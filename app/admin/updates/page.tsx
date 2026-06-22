"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Update = {
  id: number;
  title: string;
  message: string;
  status: string;
  created_at: string;
};

export default function AdminUpdatesPage() {
  const router = useRouter();

  const [updates, setUpdates] = useState<Update[]>([]);
  const [message, setMessage] = useState("");
  const [checkingLogin, setCheckingLogin] = useState(true);

  const [form, setForm] = useState({
    title: "",
    message: "",
    status: "Published",
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("usbc_admin_logged_in");

    if (isLoggedIn !== "true") {
      router.push("/admin/login");
      return;
    }

    setCheckingLogin(false);
    loadUpdates();
  }, [router]);

  async function loadUpdates() {
    const { data, error } = await supabase
      .from("CommunityUpdates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setUpdates(data || []);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function createUpdate(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Creating update...");

    const { error } = await supabase.from("CommunityUpdates").insert({
      title: form.title,
      message: form.message,
      status: form.status,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Community update created successfully.");

    setForm({
      title: "",
      message: "",
      status: "Published",
    });

    await loadUpdates();
  }

  async function updateStatus(id: number, status: string) {
    const { error } = await supabase
      .from("CommunityUpdates")
      .update({ status })
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Update status changed.");
    await loadUpdates();
  }

  async function deleteUpdate(id: number) {
    const confirmed = window.confirm("Delete this community update?");

    if (!confirmed) return;

    const { error } = await supabase
      .from("CommunityUpdates")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Community update deleted.");
    await loadUpdates();
  }

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
            Community Updates
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-gray-700">
            Post simple community notices, reminders, event updates, and public
            announcements for USBC members and visitors.
          </p>
        </div>

        {message && (
          <p className="mb-8 rounded-xl bg-yellow-100 p-4 font-bold text-gray-950">
            {message}
          </p>
        )}

        <form
          onSubmit={createUpdate}
          className="mb-10 rounded-3xl border bg-white p-8 shadow-premium"
        >
          <h2 className="mb-6 text-3xl font-black text-gray-950">
            Create Update
          </h2>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Update Title"
            className="mb-4 w-full rounded-xl border px-4 py-4 text-gray-950"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            placeholder="Write the community update here..."
            className="mb-4 h-40 w-full rounded-xl border px-4 py-4 text-gray-950"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mb-6 w-full rounded-xl border px-4 py-4 text-gray-950"
          >
            <option>Published</option>
            <option>Hidden</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-gray-950 px-8 py-4 font-bold text-white hover:bg-gray-800"
          >
            Publish Update
          </button>
        </form>

        <section>
          <h2 className="mb-6 text-3xl font-black text-gray-950">
            Existing Updates
          </h2>

          <div className="grid gap-6">
            {updates.map((update) => (
              <div
                key={update.id}
                className="rounded-3xl border bg-white p-8 shadow-premium"
              >
                <p className="mb-2 text-sm font-bold uppercase tracking-widest text-red-600">
                  {update.status}
                </p>

                <h3 className="text-2xl font-black text-gray-950">
                  {update.title}
                </h3>

                <p className="mt-3 whitespace-pre-line text-gray-700">
                  {update.message}
                </p>

                <p className="mt-4 text-sm text-gray-500">
                  Posted: {new Date(update.created_at).toLocaleString()}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => updateStatus(update.id, "Published")}
                    className="rounded-xl bg-green-700 px-5 py-3 font-bold text-white"
                  >
                    Publish
                  </button>

                  <button
                    onClick={() => updateStatus(update.id, "Hidden")}
                    className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black"
                  >
                    Hide
                  </button>

                  <button
                    onClick={() => deleteUpdate(update.id)}
                    className="rounded-xl bg-red-700 px-5 py-3 font-bold text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {updates.length === 0 && (
              <p className="rounded-3xl bg-white p-8 text-center font-bold text-gray-700">
                No community updates created yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}