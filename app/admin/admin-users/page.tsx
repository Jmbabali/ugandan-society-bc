"use client";

import AdminGuard from "@/app/components/AdminGuard";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { useEffect, useMemo, useState } from "react";

type AdminUser = {
  id: number;
  email: string;
  display_name: string;
  role: string;
  status: string;
  password_hash?: string | null;
  created_at?: string;
};

const roles = [
  { value: "super_admin", label: "Super Admin" },
  { value: "president", label: "President" },
  { value: "vice_president", label: "Vice President" },
  { value: "secretary", label: "Secretary" },
  { value: "treasurer", label: "Treasurer" },
  { value: "pro", label: "PRO" },
  { value: "events", label: "Events Coordinator" },
  { value: "fundraising", label: "Fundraising Coordinator" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const [form, setForm] = useState({
    display_name: "",
    email: "",
    role: "secretary",
    status: "Active",
    password: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Admins")
      .select("*")
      .order("display_name");

    if (error) {
      setMessage(error.message);
    } else {
      setUsers(data || []);
    }

    setLoading(false);
  }

  function openAddForm() {
    setEditingUser(null);
    setForm({
      display_name: "",
      email: "",
      role: "secretary",
      status: "Active",
      password: "",
    });
    setShowForm(true);
    setMessage("");
  }

  function openEditForm(user: AdminUser) {
    setEditingUser(user);
    setForm({
      display_name: user.display_name || "",
      email: user.email || "",
      role: user.role || "secretary",
      status: user.status || "Active",
      password: "",
    });
    setShowForm(true);
    setMessage("");
  }

  async function saveUser(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Saving...");

    const payload: any = {
      display_name: form.display_name.trim(),
      email: form.email.toLowerCase().trim(),
      role: form.role,
      status: form.status,
    };

    if (form.password.trim()) {
      payload.password_hash = await bcrypt.hash(form.password.trim(), 10);
    }

    if (editingUser) {
      const { error } = await supabase
        .from("Admins")
        .update(payload)
        .eq("id", editingUser.id);

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Executive updated successfully.");
    } else {
      if (!form.password.trim()) {
        setMessage("Please enter a password for the new executive.");
        return;
      }

      const { error } = await supabase.from("Admins").insert(payload);

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Executive added successfully.");
    }

    setShowForm(false);
    await loadUsers();
  }

  async function resetPassword(user: AdminUser) {
    const newPassword = prompt(
      `Enter a new password for ${user.display_name}:`
    );

    if (!newPassword) return;

    const password_hash = await bcrypt.hash(newPassword, 10);

    const { error } = await supabase
      .from("Admins")
      .update({ password_hash })
      .eq("id", user.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(`Password reset successfully for ${user.display_name}.`);
    await loadUsers();
  }

  async function toggleStatus(user: AdminUser) {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";

    const confirmed = confirm(
      `${newStatus === "Active" ? "Activate" : "Disable"} ${
        user.display_name
      }?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("Admins")
      .update({ status: newStatus })
      .eq("id", user.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(`Executive ${newStatus === "Active" ? "activated" : "disabled"}.`);
    await loadUsers();
  }

  async function deleteUser(user: AdminUser) {
    if (user.role === "super_admin") {
      alert("Super Admin accounts cannot be deleted from here.");
      return;
    }

    const confirmed = confirm(`Delete ${user.display_name}?`);
    if (!confirmed) return;

    const { error } = await supabase.from("Admins").delete().eq("id", user.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Executive deleted.");
    await loadUsers();
  }

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const text = `${user.display_name} ${user.email}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesRole = roleFilter === "All" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const total = users.length;
  const active = users.filter((u) => u.status === "Active").length;
  const disabled = users.filter((u) => u.status !== "Active").length;
  const superAdmins = users.filter((u) => u.role === "super_admin").length;

  return (
    <AdminGuard permission="admin_users">
      <main className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-black uppercase tracking-widest text-red-600">
                USBC Administration
              </p>

              <h1 className="text-5xl font-black text-gray-950">
                Executive Users
              </h1>

              <p className="mt-3 text-gray-600">
                Manage executive accounts, roles, status, and passwords.
              </p>
            </div>

            <button
              onClick={openAddForm}
              className="rounded-xl bg-gray-950 px-6 py-4 font-bold text-white hover:bg-gray-800"
            >
              + Add Executive
            </button>
          </div>

          {message && (
            <p className="mb-6 rounded-xl bg-yellow-100 p-4 font-bold text-gray-950">
              {message}
            </p>
          )}

          <div className="mb-8 grid gap-5 md:grid-cols-4">
            <StatCard title="Total" value={total} />
            <StatCard title="Active" value={active} color="green" />
            <StatCard title="Disabled" value={disabled} color="red" />
            <StatCard title="Super Admins" value={superAdmins} color="blue" />
          </div>

          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search executive..."
              className="flex-1 rounded-xl border bg-white px-5 py-4 text-gray-950"
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border bg-white px-5 py-4 text-gray-950"
            >
              <option>All</option>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {showForm && (
            <form
              onSubmit={saveUser}
              className="mb-8 rounded-3xl bg-white p-8 shadow"
            >
              <h2 className="mb-6 text-3xl font-black text-gray-950">
                {editingUser ? "Edit Executive" : "Add Executive"}
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <input
                  required
                  value={form.display_name}
                  onChange={(e) =>
                    setForm({ ...form, display_name: e.target.value })
                  }
                  placeholder="Full name"
                  className="rounded-xl border px-4 py-4 text-gray-950"
                />

                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="Email address"
                  className="rounded-xl border px-4 py-4 text-gray-950"
                />

                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="rounded-xl border px-4 py-4 text-gray-950"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  className="rounded-xl border px-4 py-4 text-gray-950"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>

                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder={
                    editingUser
                      ? "New password only if changing"
                      : "Temporary password"
                  }
                  className="rounded-xl border px-4 py-4 text-gray-950 md:col-span-2"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  className="rounded-xl bg-gray-950 px-6 py-4 font-bold text-white"
                >
                  Save Executive
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border px-6 py-4 font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto rounded-3xl bg-white shadow">
            <table className="w-full">
              <thead className="bg-gray-950 text-white">
                <tr>
                  <th className="p-4 text-left">Executive</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Password</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center">
                      No executive users found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-bold text-gray-950">
                        {user.display_name}
                      </td>

                      <td className="p-4">{roleLabel(user.role)}</td>

                      <td className="p-4">{user.email}</td>

                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-bold ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="p-4">
                        {user.password_hash ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                            Set
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                            Not Set
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => openEditForm(user)}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => resetPassword(user)}
                            className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-bold text-white"
                          >
                            Reset
                          </button>

                          <button
                            onClick={() => toggleStatus(user)}
                            className="rounded-lg bg-gray-800 px-3 py-2 text-sm font-bold text-white"
                          >
                            {user.status === "Active" ? "Disable" : "Activate"}
                          </button>

                          <button
                            onClick={() => deleteUser(user)}
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </AdminGuard>
  );
}

function roleLabel(role: string) {
  return roles.find((item) => item.value === role)?.label || role;
}

function StatCard({
  title,
  value,
  color = "gray",
}: {
  title: string;
  value: number;
  color?: string;
}) {
  const colors: Record<string, string> = {
    gray: "text-gray-900",
    green: "text-green-700",
    red: "text-red-600",
    blue: "text-blue-700",
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow">
      <p className="text-sm font-bold uppercase text-gray-500">{title}</p>
      <p className={`mt-3 text-4xl font-black ${colors[color]}`}>{value}</p>
    </div>
  );
}