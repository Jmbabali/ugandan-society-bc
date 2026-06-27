"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { canAccess, getAdminRole } from "@/lib/adminAccess";

const adminLinks = [
  { name: "Dashboard", href: "/admin/dashboard", permission: "dashboard" },
  { name: "Members", href: "/admin/members", permission: "members" },
  { name: "Events", href: "/admin/events", permission: "events" },
  { name: "Email", href: "/admin/email", permission: "email" },
  { name: "Renewals", href: "/admin/renewals", permission: "renewals" },
  { name: "Businesses", href: "/admin/businesses", permission: "businesses" },
  { name: "Gallery", href: "/admin/gallery", permission: "gallery" },
  { name: "Updates", href: "/admin/updates", permission: "updates" },
  { name: "Donations", href: "/admin/donations", permission: "donations" },
    { name: "Admin Users", href: "/admin/admin-users", permission: "admin-users" },
  { name: "Settings", href: "/admin/settings", permission: "settings" },
];

export default function AdminNav() {
  const router = useRouter();

  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
  setRole(localStorage.getItem("usbc_admin_role") || "");
  setName(localStorage.getItem("usbc_admin_name") || "");
  setEmail(localStorage.getItem("usbc_admin_email") || "");
}, []);

  function handleLogout() {
    localStorage.removeItem("usbc_admin_logged_in");
    localStorage.removeItem("usbc_admin_role");
    localStorage.removeItem("usbc_admin_name");
    localStorage.removeItem("usbc_admin_email");
    router.push("/admin/login");
  }

  if (!role) return null;

  return (
    <div className="mb-8 rounded-3xl bg-gray-950 p-5 shadow-xl">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
  <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
    USBC Admin
  </p>

  <h2 className="text-2xl font-black text-white">
    {name || "Administrator"}
  </h2>

  <p className="text-sm text-gray-300">
    {role}
  </p>

  <p className="text-xs text-gray-400">
    {email}
  </p>
</div>

        <button
          onClick={handleLogout}
          className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {adminLinks
          .filter((item) => canAccess(role as any, item.permission))
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black hover:bg-yellow-300"
            >
              {item.name}
            </Link>
          ))}
      </div>
    </div>
  );
}