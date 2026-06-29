"use client";

import AdminGuard from "@/app/components/AdminGuard";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarDays,
  DollarSign,
  Gift,
  Mail,
  RefreshCcw,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Executive");
  const [lastUpdated, setLastUpdated] = useState("");

  const [stats, setStats] = useState({
    totalMembers: 0,
    approvedMembers: 0,
    pendingMembers: 0,
    expiredMembers: 0,
    paidMembers: 0,
    unpaidMembers: 0,
    revenue: 0,
    totalEvents: 0,
    totalBusinesses: 0,
    pendingBusinesses: 0,
    totalDonations: 0,
    donationsAmount: 0,
  });

  const [recentMembers, setRecentMembers] = useState<any[]>([]);
  const [recentBusinesses, setRecentBusinesses] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  useEffect(() => {
    setAdminName(localStorage.getItem("usbc_admin_name") || "Executive");
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);

    const [
      { data: members },
      { data: events },
      { data: businesses },
      { data: donations },
    ] = await Promise.all([
      supabase.from("Members").select("*"),
      supabase.from("Events").select("*"),
      supabase.from("Businesses").select("*"),
      supabase.from("Donations").select("*"),
    ]);

    const today = new Date();

    const memberRows = members || [];
    const eventRows = events || [];
    const businessRows = businesses || [];
    const donationRows = donations || [];

    const paidMembers = memberRows.filter(
      (m) => m.payment_status === "Paid"
    );

    const paidDonations = donationRows.filter(
      (d) => d.payment_status === "Paid"
    );

    const revenue = paidMembers.reduce(
      (sum, m) => sum + Number(m.payment_amount || 0),
      0
    );

    const donationsAmount = paidDonations.reduce(
      (sum, d) => sum + Number(d.amount || 0),
      0
    );

    setStats({
      totalMembers: memberRows.length,
      approvedMembers: memberRows.filter((m) => m.status === "Approved").length,
      pendingMembers: memberRows.filter((m) => m.status === "Pending").length,
      expiredMembers: memberRows.filter(
        (m) => m.expiry_date && new Date(m.expiry_date) < today
      ).length,
      paidMembers: paidMembers.length,
      unpaidMembers: memberRows.filter((m) => m.payment_status !== "Paid")
        .length,
      revenue,
      totalEvents: eventRows.length,
      totalBusinesses: businessRows.length,
      pendingBusinesses: businessRows.filter((b) => b.status === "Pending")
        .length,
      totalDonations: paidDonations.length,
      donationsAmount,
    });

    setRecentMembers(
      [...memberRows].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, 5)
    );

    setRecentBusinesses(
      [...businessRows].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, 5)
    );

    setRecentEvents(
      [...eventRows]
        .sort(
          (a, b) =>
            new Date(b.event_date || b.created_at || 0).getTime() -
            new Date(a.event_date || a.created_at || 0).getTime()
        )
        .slice(0, 5)
    );

    setLastUpdated(new Date().toLocaleString());
    setLoading(false);
  }

  if (loading) {
    return (
      <AdminGuard permission="dashboard">
        <main className="min-h-screen">
          <div className="rounded-3xl bg-white p-8 font-bold shadow">
            Loading dashboard...
          </div>
        </main>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard permission="dashboard">
      <main className="min-h-screen">
        <section className="mb-8 overflow-hidden rounded-[2rem] bg-gray-950 p-8 text-white shadow-2xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-black uppercase tracking-widest text-yellow-400">
                Welcome back,
              </p>

              <h1 className="mt-2 text-5xl font-black">{adminName}</h1>

              <p className="mt-4 max-w-3xl text-lg text-gray-300">
                Here&apos;s what&apos;s happening across the Ugandan Society in BC
                today.
              </p>

              <p className="mt-3 text-sm font-bold text-gray-400">
                Last updated: {lastUpdated || "Loading..."}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
              <ShieldCheck className="mx-auto h-12 w-12 text-yellow-400" />
              <p className="mt-3 text-sm font-bold uppercase text-gray-300">
                Secure Portal
              </p>
              <p className="text-2xl font-black">USBC</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <QuickButton href="/admin/members" icon={<Users />} label="Members" />
            <QuickButton href="/admin/events" icon={<CalendarDays />} label="Events" />
            <QuickButton href="/admin/email" icon={<Mail />} label="Send Email" />
            <QuickButton href="/admin/admin-users" icon={<Settings />} label="Admin Users" />

            <button
              onClick={loadDashboard}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
            >
              <RefreshCcw className="h-5 w-5" />
              Refresh
            </button>
          </div>
        </section>

        <section className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={<Users />} title="Total Members" value={stats.totalMembers} note={`${stats.approvedMembers} approved`} color="dark" />
          <StatCard icon={<AlertTriangle />} title="Pending Approvals" value={stats.pendingMembers} note="Members waiting review" color="yellow" />
          <StatCard icon={<DollarSign />} title="Membership Revenue" value={`$${stats.revenue.toFixed(2)}`} note={`${stats.paidMembers} paid members only`} color="green" />
          <StatCard icon={<AlertTriangle />} title="Expired Members" value={stats.expiredMembers} note="Require renewal follow-up" color="red" />
          <StatCard icon={<CalendarDays />} title="Events" value={stats.totalEvents} note="Total events created" color="blue" />
          <StatCard icon={<BriefcaseBusiness />} title="Businesses" value={stats.totalBusinesses} note={`${stats.pendingBusinesses} pending approval`} color="purple" />
          <StatCard icon={<Gift />} title="Paid Donations" value={`$${stats.donationsAmount.toFixed(2)}`} note={`${stats.totalDonations} completed donations`} color="green" />
          <StatCard icon={<DollarSign />} title="Unpaid Members" value={stats.unpaidMembers} note="Payment not completed" color="red" />
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-3">
          <ActionCard title="Member Approvals" description="Review applications, issue member IDs, and manage membership records." href="/admin/members" button="Review Members" />
          <ActionCard title="Business Approvals" description="Approve or reject businesses submitted to the community directory." href="/admin/businesses" button="Review Businesses" />
          <ActionCard title="Executive Access" description="Manage passwords, roles, permissions, and executive accounts." href="/admin/admin-users" button="Manage Access" />
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <Panel title="Recent Members" href="/admin/members">
            {recentMembers.length === 0 ? (
              <Empty text="No recent members." />
            ) : (
              recentMembers.map((member) => (
                <Record
                  key={member.id}
                  title={`${member.first_name || ""} ${member.last_name || ""}`}
                  line1={member.member_id || "Pending member ID"}
                  line2={member.status || "No status"}
                />
              ))
            )}
          </Panel>

          <Panel title="Recent Businesses" href="/admin/businesses">
            {recentBusinesses.length === 0 ? (
              <Empty text="No recent businesses." />
            ) : (
              recentBusinesses.map((business) => (
                <Record
                  key={business.id}
                  title={business.business_name || "Unnamed business"}
                  line1={business.category || "No category"}
                  line2={business.status || "No status"}
                />
              ))
            )}
          </Panel>

          <Panel title="Recent Events" href="/admin/events">
            {recentEvents.length === 0 ? (
              <Empty text="No recent events." />
            ) : (
              recentEvents.map((event) => (
                <Record
                  key={event.id}
                  title={event.title || "Untitled event"}
                  line1={
                    event.event_date
                      ? new Date(event.event_date).toLocaleDateString()
                      : "No date"
                  }
                  line2={event.location || "No location"}
                />
              ))
            )}
          </Panel>
        </section>
      </main>
    </AdminGuard>
  );
}

function QuickButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-gray-950 hover:bg-yellow-400"
    >
      <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      {label}
    </Link>
  );
}

function StatCard({
  icon,
  title,
  value,
  note,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  note: string;
  color: "dark" | "green" | "yellow" | "red" | "blue" | "purple";
}) {
  const accents: Record<string, string> = {
    dark: "bg-gray-950",
    green: "bg-green-600",
    yellow: "bg-yellow-400",
    red: "bg-red-600",
    blue: "bg-blue-600",
    purple: "bg-purple-600",
  };

  const iconStyles: Record<string, string> = {
    dark: "bg-gray-950 text-white",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
      <div className={`h-2 ${accents[color]}`} />
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className={`rounded-2xl p-3 ${iconStyles[color]}`}>
            <span className="[&>svg]:h-7 [&>svg]:w-7">{icon}</span>
          </div>

          <div>
            <p className="text-sm font-black uppercase text-gray-500">{title}</p>
            <p className="mt-2 text-4xl font-black text-gray-950">{value}</p>
            <p className="mt-1 text-sm font-semibold text-gray-500">{note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
  button,
}: {
  title: string;
  description: string;
  href: string;
  button: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-7 shadow-lg">
      <h2 className="text-2xl font-black text-gray-950">{title}</h2>
      <p className="mt-3 leading-7 text-gray-600">{description}</p>

      <Link
        href={href}
        className="mt-6 inline-block rounded-xl bg-gray-950 px-5 py-3 font-bold text-white hover:bg-gray-800"
      >
        {button}
      </Link>
    </div>
  );
}

function Panel({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-white p-7 shadow-lg">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-950">{title}</h2>
        <Link href={href} className="font-bold text-blue-600 hover:underline">
          View all
        </Link>
      </div>

      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Record({
  title,
  line1,
  line2,
}: {
  title: string;
  line1: string;
  line2: string;
}) {
  return (
    <div className="rounded-2xl border p-4 hover:bg-gray-50">
      <p className="font-black text-gray-950">{title}</p>
      <p className="mt-1 text-sm text-gray-600">{line1}</p>
      <p className="text-sm text-gray-500">{line2}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-2xl bg-gray-50 p-5 text-sm font-bold text-gray-500">
      {text}
    </p>
  );
}