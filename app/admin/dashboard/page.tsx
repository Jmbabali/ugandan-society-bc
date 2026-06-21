"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AdminNav from "@/app/components/AdminNav";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalMembers: 0,
    approvedMembers: 0,
    pendingMembers: 0,
    rejectedMembers: 0,
    expiredMembers: 0,
    paidMembers: 0,
    unpaidMembers: 0,
    revenue: 0,
    totalEvents: 0,
    totalRegistrations: 0,
  });

  const [recentMembers, setRecentMembers] = useState<any[]>([]);
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("usbc_admin_logged_in");

    if (isLoggedIn !== "true") {
      router.push("/admin/login");
      return;
    }

    loadDashboard();
  }, [router]);

  async function loadDashboard() {
    try {
      const { data: members } = await supabase.from("Members").select("*");
      const { data: events } = await supabase.from("Events").select("*");
      const { data: registrations } = await supabase
        .from("EventRegistrations")
        .select("*");

      const today = new Date();

      const totalMembers = members?.length || 0;

      const approvedMembers =
        members?.filter((m) => m.status === "Approved").length || 0;

      const pendingMembers =
        members?.filter((m) => m.status === "Pending").length || 0;

      const rejectedMembers =
        members?.filter((m) => m.status === "Rejected").length || 0;

      const expiredMembers =
        members?.filter((m) => {
          if (!m.expiry_date) return false;
          return new Date(m.expiry_date) < today;
        }).length || 0;

      const paidMembers =
        members?.filter((m) => m.payment_status === "Paid").length || 0;

      const unpaidMembers =
        members?.filter((m) => m.payment_status !== "Paid").length || 0;

      const revenue =
        members?.reduce((sum, m) => sum + Number(m.payment_amount || 0), 0) ||
        0;

      setStats({
        totalMembers,
        approvedMembers,
        pendingMembers,
        rejectedMembers,
        expiredMembers,
        paidMembers,
        unpaidMembers,
        revenue,
        totalEvents: events?.length || 0,
        totalRegistrations: registrations?.length || 0,
      });

      setRecentMembers(
        [...(members || [])].sort((a, b) => b.id - a.id).slice(0, 5)
      );

      setRecentRegistrations(
        [...(registrations || [])].sort((a, b) => b.id - a.id).slice(0, 5)
      );

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="rounded-3xl bg-white p-8 font-bold shadow-xl">
          Loading Dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <AdminNav />

        <div className="mb-10">
          <p className="mb-3 font-bold uppercase tracking-widest text-red-600">
            USBC Executive Dashboard
          </p>

          <h1 className="text-5xl font-black text-gray-950">
            Organization Overview
          </h1>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-5">
          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm uppercase text-gray-500">Members</p>
            <p className="mt-2 text-4xl font-black">{stats.totalMembers}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm uppercase text-gray-500">Approved</p>
            <p className="mt-2 text-4xl font-black text-green-700">
              {stats.approvedMembers}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm uppercase text-gray-500">Pending</p>
            <p className="mt-2 text-4xl font-black text-yellow-600">
              {stats.pendingMembers}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm uppercase text-gray-500">Events</p>
            <p className="mt-2 text-4xl font-black">{stats.totalEvents}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm uppercase text-gray-500">Registrations</p>
            <p className="mt-2 text-4xl font-black">
              {stats.totalRegistrations}
            </p>
          </div>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm uppercase text-gray-500">Revenue</p>
            <p className="mt-2 text-3xl font-black text-green-700">
              ${stats.revenue.toFixed(2)}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm uppercase text-gray-500">Paid</p>
            <p className="mt-2 text-3xl font-black">{stats.paidMembers}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm uppercase text-gray-500">Unpaid</p>
            <p className="mt-2 text-3xl font-black">{stats.unpaidMembers}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm uppercase text-gray-500">Expired</p>
            <p className="mt-2 text-3xl font-black text-red-600">
              {stats.expiredMembers}
            </p>
          </div>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/members"
            className="rounded-3xl bg-gray-950 p-8 text-center font-bold text-white"
          >
            Manage Members
          </Link>

          <Link
            href="/admin/events"
            className="rounded-3xl bg-yellow-400 p-8 text-center font-bold text-black"
          >
            Manage Events
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="rounded-3xl bg-white p-8 text-center font-bold shadow"
          >
            Refresh Dashboard
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-6 text-3xl font-black">Recent Members</h2>

            <div className="space-y-4">
              {recentMembers.map((member) => (
                <div key={member.id} className="rounded-xl border p-4">
                  <p className="font-black">
                    {member.first_name} {member.last_name}
                  </p>

                  <p className="text-sm text-gray-600">
                    {member.member_id || "Pending ID"}
                  </p>

                  <p className="text-sm text-gray-600">{member.status}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-6 text-3xl font-black">
              Recent Event Registrations
            </h2>

            <div className="space-y-4">
              {recentRegistrations.map((registration) => (
                <div key={registration.id} className="rounded-xl border p-4">
                  <p className="font-black">{registration.member_name}</p>

                  <p className="text-sm text-gray-600">
                    Event #{registration.event_id}
                  </p>

                  <p className="text-sm text-green-700">
                    {registration.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}