"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const adminLinks = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Members", href: "/admin/members" },
  { name: "Events", href: "/admin/events" },
  { name: "Email", href: "/admin/email" },
  { name: "Renewals", href: "/admin/renewals" },
  { name: "Businesses", href: "/admin/businesses" },
  { name: "Gallery", href: "/admin/gallery" },
  { name: "Updates", href: "/admin/updates" },
  { name: "Donations", href: "/admin/donations" },
];

export default function AdminNav() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("usbc_admin_logged_in");
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
        {adminLinks.map((item) => (
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