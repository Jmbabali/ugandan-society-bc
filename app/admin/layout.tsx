"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  { name: "Admin Users", href: "/admin/admin-users" },
  { name: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [name, setName] = useState("Administrator");
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");

  const publicPages = [
    "/admin/login",
    "/admin/access-denied",
    "/admin/change-password",
  ];

  useEffect(() => {
    setName(localStorage.getItem("usbc_admin_name") || "Administrator");
    setRole(localStorage.getItem("usbc_admin_role") || "admin");
    setEmail(localStorage.getItem("usbc_admin_email") || "");
  }, []);

  function logout() {
    localStorage.removeItem("usbc_admin_logged_in");
    localStorage.removeItem("usbc_admin_role");
    localStorage.removeItem("usbc_admin_name");
    localStorage.removeItem("usbc_admin_email");

    router.push("/admin/login");
  }

  if (publicPages.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-50 border-b bg-gray-950 text-white shadow">
        <div className="mx-auto max-w-[1600px] px-5 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
                USBC Admin
              </p>

              <h1 className="text-2xl font-black">
                Management Portal
              </h1>

              <p className="text-sm text-gray-400">
                {name} • {role} • {email}
              </p>
            </div>

            <button
              onClick={logout}
              className="w-fit rounded-xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto pb-2">
            {adminLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition ${
                  pathname === item.href
                    ? "bg-yellow-400 text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-5 py-8">
        {children}
      </main>
    </div>
  );
}