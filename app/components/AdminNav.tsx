"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAdminRole, canAccess } from "@/lib/adminAccess";

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
  { name: "Reports", href: "/admin/reports", permission: "reports" },
];

  const role = getAdminRole();
  export default function AdminNav() {
  const router = useRouter();
  const role = getAdminRole();

  function handleLogout() {
    localStorage.removeItem("usbc_admin_logged_in");
    localStorage.removeItem("usbc_admin_role");
    localStorage.removeItem("usbc_admin_name");
    localStorage.removeItem("usbc_admin_email");
    router.push("/admin/login");
  }

  return (
    <div className="mb-8 rounded-3xl bg-gray-950 p-5 shadow-xl">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
            USBC Admin
          </p>
          <h2 className="text-2xl font-black text-white">
            Management Panel
          </h2>
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
          .filter((item) => canAccess(role, item.permission))
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