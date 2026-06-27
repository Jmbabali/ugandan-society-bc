"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { canAccess, getAdminRole } from "@/lib/adminAccess";

export default function AdminGuard({
  permission,
  children,
}: {
  permission: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem("usbc_admin_logged_in");

    if (loggedIn !== "true") {
      router.push("/admin/login");
      return;
    }

    const role = getAdminRole();

    if (!canAccess(role, permission)) {
      router.push("/admin/access-denied");
      return;
    }

    setAllowed(true);
    setChecking(false);
  }, [router, permission]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="rounded-3xl bg-white p-8 font-bold shadow-xl">
          Checking access...
        </p>
      </main>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}