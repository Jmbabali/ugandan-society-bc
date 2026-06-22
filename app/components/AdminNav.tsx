import Link from "next/link";

export default function AdminNav() {
  return (
    <div className="bg-gray-100 px-6 pt-8">
      <div className="mx-auto max-w-7xl rounded-3xl border bg-white p-4 shadow-premium">
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/dashboard" className="rounded-xl bg-gray-950 px-6 py-4 font-bold text-white">
            Dashboard
          </Link>

          <Link href="/admin/members" className="rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black">
            Members
          </Link>

          <Link href="/admin/events" className="rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black">
            Events
          </Link>

          <Link href="/admin/email" className="rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black">
            Email
          </Link>

          <Link href="/admin/renewals" className="rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black">
            Renewals
          </Link>

          <Link href="/admin/businesses" className="rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black">
            Businesses
          </Link>

          <Link href="/admin/gallery" className="rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black">
            Gallery
          </Link>

          <Link href="/admin/updates" className="rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black hover:bg-yellow-300">
            Updates
          </Link>

        </div>
      </div>
    </div>
  );
}