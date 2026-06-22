"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
    totalBusinesses: 0,
    approvedBusinesses: 0,
    pendingBusinesses: 0,
  });

  const [recentMembers, setRecentMembers] = useState<any[]>([]);
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);
  const [recentBusinesses, setRecentBusinesses] = useState<any[]>([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("usbc_admin_logged_in");

    if (isLoggedIn !== "true") {
      router.push("/admin/login");
      return;
    }

    loadDashboard();
  }, [router]);

  async function loadDashboard() {
    const { data: members } = await supabase.from("Members").select("*");
    const { data: events } = await supabase.from("Events").select("*");
    const { data: registrations } = await supabase
      .from("EventRegistrations")
      .select("*");
    const { data: businesses } = await supabase.from("Businesses").select("*");

    const today = new Date();

    const totalMembers = members?.length || 0;
    const approvedMembers =
      members?.filter((m) => m.status === "Approved").length || 0;
    const pendingMembers =
      members?.filter((m) => m.status === "Pending").length || 0;
    const rejectedMembers =
      members?.filter((m) => m.status === "Rejected").length || 0;
    const expiredMembers =
      members?.filter((m) => m.expiry_date && new Date(m.expiry_date) < today)
        .length || 0;
    const paidMembers =
      members?.filter((m) => m.payment_status === "Paid").length || 0;
    const unpaidMembers =
      members?.filter((m) => m.payment_status !== "Paid").length || 0;

    const revenue =
      members?.reduce((sum, m) => sum + Number(m.payment_amount || 0), 0) || 0;

    const totalBusinesses = businesses?.length || 0;
    const approvedBusinesses =
      businesses?.filter((b) => b.status === "Approved").length || 0;
    const pendingBusinesses =
      businesses?.filter((b) => b.status === "Pending").length || 0;

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
      totalBusinesses,
      approvedBusinesses,
      pendingBusinesses,
    });

    setRecentMembers(
      [...(members || [])].sort((a, b) => b.id - a.id).slice(0, 5)
    );

    setRecentRegistrations(
      [...(registrations || [])].sort((a, b) => b.id - a.id).slice(0, 5)
    );

    setRecentBusinesses(
      [...(businesses || [])].sort((a, b) => b.id - a.id).slice(0, 5)
    );

    setLoading(false);
  }

  function percentage(value: number, total: number) {
    if (!total) return 0;
    return Math.round((value / total) * 100);
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

  const memberApprovalRate = percentage(
    stats.approvedMembers,
    stats.totalMembers
  );

  const paymentRate = percentage(stats.paidMembers, stats.totalMembers);

  const businessApprovalRate = percentage(
    stats.approvedBusinesses,
    stats.totalBusinesses
  );

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-3 font-bold uppercase tracking-widest text-red-600">
            USBC Executive Dashboard
          </p>

          <h1 className="text-5xl font-black text-gray-950">
            Organization Overview
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-gray-700">
            A real-time overview of membership, revenue, events, registrations,
            and business directory activity.
          </p>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-gray-950 p-7 text-white shadow">
            <p className="text-sm font-bold uppercase text-gray-300">
              Total Members
            </p>
            <p className="mt-3 text-5xl font-black">{stats.totalMembers}</p>
            <p className="mt-2 text-sm text-gray-300">
              {stats.approvedMembers} approved members
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow">
            <p className="text-sm font-bold uppercase text-gray-500">
              Membership Revenue
            </p>
            <p className="mt-3 text-5xl font-black text-green-700">
              ${stats.revenue.toFixed(2)}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              From paid membership records
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow">
            <p className="text-sm font-bold uppercase text-gray-500">Events</p>
            <p className="mt-3 text-5xl font-black">{stats.totalEvents}</p>
            <p className="mt-2 text-sm text-gray-600">
              {stats.totalRegistrations} total registrations
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow">
            <p className="text-sm font-bold uppercase text-gray-500">
              Businesses
            </p>
            <p className="mt-3 text-5xl font-black">
              {stats.totalBusinesses}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              {stats.approvedBusinesses} approved listings
            </p>
          </div>
        </div>

        <div className="mb-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-black text-gray-950">
              Membership Health
            </h2>

            <div className="space-y-5">
              <div>
                <div className="mb-2 flex justify-between text-sm font-bold">
                  <span>Approval Rate</span>
                  <span>{memberApprovalRate}%</span>
                </div>
                <div className="h-4 rounded-full bg-gray-200">
                  <div
                    className="h-4 rounded-full bg-green-600"
                    style={{ width: `${memberApprovalRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm font-bold">
                  <span>Payment Rate</span>
                  <span>{paymentRate}%</span>
                </div>
                <div className="h-4 rounded-full bg-gray-200">
                  <div
                    className="h-4 rounded-full bg-yellow-400"
                    style={{ width: `${paymentRate}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="rounded-2xl bg-green-50 p-4">
                  <p className="text-sm text-gray-500">Approved</p>
                  <p className="text-3xl font-black text-green-700">
                    {stats.approvedMembers}
                  </p>
                </div>

                <div className="rounded-2xl bg-yellow-50 p-4">
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-3xl font-black text-yellow-700">
                    {stats.pendingMembers}
                  </p>
                </div>

                <div className="rounded-2xl bg-red-50 p-4">
                  <p className="text-sm text-gray-500">Rejected</p>
                  <p className="text-3xl font-black text-red-700">
                    {stats.rejectedMembers}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-100 p-4">
                  <p className="text-sm text-gray-500">Expired</p>
                  <p className="text-3xl font-black text-gray-950">
                    {stats.expiredMembers}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-black text-gray-950">
              Payment Summary
            </h2>

            <div className="grid gap-4">
              <div className="rounded-2xl bg-green-50 p-5">
                <p className="text-sm font-bold uppercase text-gray-500">
                  Paid Members
                </p>
                <p className="mt-2 text-4xl font-black text-green-700">
                  {stats.paidMembers}
                </p>
              </div>

              <div className="rounded-2xl bg-red-50 p-5">
                <p className="text-sm font-bold uppercase text-gray-500">
                  Unpaid / Pending
                </p>
                <p className="mt-2 text-4xl font-black text-red-700">
                  {stats.unpaidMembers}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-950 p-5 text-white">
                <p className="text-sm font-bold uppercase text-gray-300">
                  Total Revenue
                </p>
                <p className="mt-2 text-4xl font-black">
                  ${stats.revenue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-black text-gray-950">
              Business Directory
            </h2>

            <div>
              <div className="mb-2 flex justify-between text-sm font-bold">
                <span>Approval Rate</span>
                <span>{businessApprovalRate}%</span>
              </div>
              <div className="mb-6 h-4 rounded-full bg-gray-200">
                <div
                  className="h-4 rounded-full bg-gray-950"
                  style={{ width: `${businessApprovalRate}%` }}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl bg-white p-5 shadow-sm border">
                <p className="text-sm font-bold uppercase text-gray-500">
                  Total Businesses
                </p>
                <p className="mt-2 text-4xl font-black">
                  {stats.totalBusinesses}
                </p>
              </div>

              <div className="rounded-2xl bg-green-50 p-5">
                <p className="text-sm font-bold uppercase text-gray-500">
                  Approved
                </p>
                <p className="mt-2 text-4xl font-black text-green-700">
                  {stats.approvedBusinesses}
                </p>
              </div>

              <div className="rounded-2xl bg-yellow-50 p-5">
                <p className="text-sm font-bold uppercase text-gray-500">
                  Pending
                </p>
                <p className="mt-2 text-4xl font-black text-yellow-700">
                  {stats.pendingBusinesses}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          <Link
            href="/admin/members"
            className="rounded-3xl bg-gray-950 p-8 text-center font-bold text-white hover:bg-gray-800"
          >
            Manage Members
          </Link>

          <Link
            href="/admin/events"
            className="rounded-3xl bg-yellow-400 p-8 text-center font-bold text-black hover:bg-yellow-300"
          >
            Manage Events
          </Link>

          <Link
            href="/admin/businesses"
            className="rounded-3xl bg-white p-8 text-center font-bold shadow hover:bg-gray-50"
          >
            Manage Businesses
          </Link>

          <button
            onClick={loadDashboard}
            className="rounded-3xl bg-white p-8 text-center font-bold shadow hover:bg-gray-50"
          >
            Refresh Dashboard
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-black">Recent Members</h2>

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
            <h2 className="mb-6 text-2xl font-black">
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

          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-black">Recent Businesses</h2>

            <div className="space-y-4">
              {recentBusinesses.map((business) => (
                <div key={business.id} className="rounded-xl border p-4">
                  <p className="font-black">{business.business_name}</p>
                  <p className="text-sm text-gray-600">{business.category}</p>
                  <p className="text-sm text-gray-600">{business.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}