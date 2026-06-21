import Link from "next/link";

export default function AdminNav() {
  return (
    <div className="mb-8 rounded-3xl border bg-white p-4 shadow-premium">
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/dashboard" className="rounded-xl bg-gray-950 px-5 py-3 font-bold text-white hover:bg-gray-800">
          Dashboard
        </Link>

        <Link href="/admin/members" className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black hover:bg-yellow-300">
          Members
        </Link>

        <Link href="/admin/events" className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black hover:bg-yellow-300">
          Events
        </Link>

        <Link href="/admin/email" className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black hover:bg-yellow-300">
          Email
        </Link>

        <Link href="/admin/renewals" className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black hover:bg-yellow-300">
          Renewals
        </Link>
      </div>
    </div>
  );
}