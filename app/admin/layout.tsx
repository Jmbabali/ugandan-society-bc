"use client";

import { usePathname } from "next/navigation";
import AdminNav from "@/app/components/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <>
      {!isLoginPage && <AdminNav />}
      {children}
    </>
  );
}