import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950 shadow-lg">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-90">
            <Image src="/logo.png" alt="USBC Logo" width={55} height={55} priority />

            <div>
              <h1 className="text-lg font-bold text-white">
                Ugandan Society in BC
              </h1>
              <p className="text-xs text-gray-400">
                Building Connections • Preserving Heritage
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm lg:flex">
            <Link href="/" className="font-medium text-white transition hover:text-yellow-400">
              Home
            </Link>

            <Link href="/about" className="font-medium text-white transition hover:text-yellow-400">
              About
            </Link>

            <Link href="/membership" className="font-medium text-white transition hover:text-yellow-400">
              Membership
            </Link>

            <Link href="/events" className="font-medium text-white transition hover:text-yellow-400">
              Events
            </Link>

            <Link href="/resources" className="font-medium text-white transition hover:text-yellow-400">
              Resources
            </Link>

            <div className="relative group">
              <button className="py-8 font-medium text-white transition hover:text-yellow-400">
                Member Area ▼
              </button>

              <div className="invisible absolute left-0 top-full w-56 overflow-hidden rounded-xl border bg-white text-gray-800 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                <Link href="/login" className="block px-5 py-3 hover:bg-gray-100">
                  Member Login
                </Link>

                <Link href="/admin/login" className="block px-5 py-3 hover:bg-gray-100">
                  Admin Login
                </Link>

                <Link href="/webmail" className="block px-5 py-3 hover:bg-gray-100">
                  Webmail
                </Link>
              </div>
            </div>
          </nav>

          <Link
            href="/membership"
            className="hidden rounded-lg bg-yellow-400 px-5 py-3 font-bold text-black transition hover:bg-yellow-300 lg:block"
          >
            Join USBC
          </Link>
        </div>
      </div>
    </header>
  );
}