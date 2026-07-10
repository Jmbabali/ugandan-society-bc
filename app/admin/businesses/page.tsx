"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Business = {
  id?: string;
  business_name: string;
  owner_name: string;
  category: string;
  status: string;
  email: string;
  phone: string;
  description: string;
};

const emptyForm: Business = {
  business_name: "",
  owner_name: "",
  category: "",
  status: "Pending",
  email: "",
  phone: "",
  description: "",
};

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [form, setForm] = useState<Business>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  async function fetchBusinesses() {
    const { data, error } = await supabase
      .from("Businesses")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setBusinesses(data);
  }

  async function saveBusiness() {
    if (!form.business_name || !form.owner_name) {
      alert("Business name and owner name are required.");
      return;
    }

let logoUrl = "";

if (logoFile) {
  const fileExt = logoFile.name.split(".").pop() || "png";
  const fileName = `BUS-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("business-logos")
    .upload(fileName, logoFile, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    alert(uploadError.message);
    return;
  }

  const { data } = supabase.storage
    .from("business-logos")
    .getPublicUrl(fileName);

  logoUrl = data.publicUrl;
}

    if (editingId) {
  const updateData = {
    ...form,
    ...(logoUrl ? { logo_url: logoUrl } : {}),
  };

  const { error } = await supabase
    .from("Businesses")
    .update(updateData)
    .eq("id", editingId);

  if (error) {
    alert(error.message);
    return;
  }
} else {
  const insertData = {
    ...form,
    logo_url: logoUrl,
  };

  const { error } = await supabase
    .from("Businesses")
    .insert([insertData]);

  if (error) {
    alert(error.message);
    return;
  }
}

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    fetchBusinesses();
  }

  async function updateStatus(id: string, status: string) {
    await supabase
      .from("Businesses")
      .update({ status })
      .eq("id", id);

    fetchBusinesses();
  }

  async function deleteBusiness(id: string) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this business?"
    );

    if (!confirmDelete) return;

    await supabase.from("Businesses").delete().eq("id", id);
    fetchBusinesses();
  }

  function startEdit(business: Business) {
    setForm({
      business_name: business.business_name || "",
      owner_name: business.owner_name || "",
      category: business.category || "",
      status: business.status || "Pending",
      email: business.email || "",
      phone: business.phone || "",
      description: business.description || "",
    });

    setEditingId(business.id || null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black uppercase tracking-widest text-red-600">
              USBC Admin
            </p>

            <h1 className="text-4xl font-black text-gray-900">
              Business Directory Management
            </h1>

            <p className="mt-2 text-gray-600">
              Add, edit, approve, disable, or remove business directory listings.
            </p>
          </div>

          <button
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="rounded-xl bg-gray-950 px-6 py-4 font-bold text-white hover:bg-gray-800"
          >
            {showForm ? "Close Form" : "+ Add Business"}
          </button>
        </div>

        {showForm && (
          <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-black text-gray-950">
              {editingId ? "Edit Business" : "Add Business"}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={form.business_name}
                onChange={(e) =>
                  setForm({ ...form, business_name: e.target.value })
                }
                placeholder="Business name"
                className="rounded-xl border px-4 py-3"
              />

              <input
                value={form.owner_name}
                onChange={(e) =>
                  setForm({ ...form, owner_name: e.target.value })
                }
                placeholder="Owner name"
                className="rounded-xl border px-4 py-3"
              />

              <input
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                placeholder="Category"
                className="rounded-xl border px-4 py-3"
              />

              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="rounded-xl border px-4 py-3"
              >
                <option>Pending</option>
                <option>Approved</option>
                <option>Disabled</option>
              </select>

              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="rounded-xl border px-4 py-3"
              />

              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone"
                className="rounded-xl border px-4 py-3"
              />
<div>
  <label className="mb-2 block text-sm font-bold uppercase text-gray-500">
    Business Logo
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
    className="w-full rounded-xl border bg-white px-4 py-4 text-gray-950"
  />

  <p className="mt-2 text-sm text-gray-500">
    Upload the business logo (optional).
  </p>
</div>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Business description"
                className="md:col-span-2 min-h-32 rounded-xl border px-4 py-3"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={saveBusiness}
                className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
              >
                {editingId ? "Save Changes" : "Add Business"}
              </button>

              <button
                onClick={cancelForm}
                className="rounded-xl bg-gray-200 px-6 py-3 font-bold text-gray-900 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {businesses.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center font-bold text-gray-500 shadow">
              No businesses found.
            </div>
          ) : (
            businesses.map((business) => (
              <div
                key={business.id}
                className="rounded-3xl bg-white p-6 shadow-lg"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-gray-950">
                      {business.business_name}
                    </h2>

                    <p className="mt-1 text-gray-600">
                      Owner: {business.owner_name || "N/A"}
                    </p>

                    <p className="text-gray-600">
                      Category: {business.category || "N/A"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-black ${
                      business.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : business.status === "Disabled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {business.status || "Pending"}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 text-gray-700 md:grid-cols-2">
                  <p>
                    <strong>Email:</strong> {business.email || "N/A"}
                  </p>

                  <p>
                    <strong>Phone:</strong> {business.phone || "N/A"}
                  </p>
                </div>

                <p className="mt-4 leading-7 text-gray-600">
                  {business.description || "No description provided."}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      updateStatus(business.id!, "Approved")
                    }
                    className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(business.id!, "Pending")
                    }
                    className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black hover:bg-yellow-300"
                  >
                    Mark Pending
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(business.id!, "Disabled")
                    }
                    className="rounded-xl bg-gray-950 px-5 py-3 font-bold text-white hover:bg-gray-800"
                  >
                    Disable
                  </button>

                  <button
                    onClick={() => startEdit(business)}
                    className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteBusiness(business.id!)}
                    className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}