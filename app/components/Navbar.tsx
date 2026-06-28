"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/95 shadow-lg backdrop-blur">
      <div className="border-b border-white/10 bg-black/30 px-6 py-2 text-xs text-gray-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p>Building Connections • Preserving Heritage • Empowering Community</p>
          <p className="hidden md:block">info@ugandansocietybc.ca</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-3 transition hover:opacity-90" onClick={closeMenu}>
            <Image
              src="/logo.png"
              alt="USBC Logo"
              width={58}
              height={58}
              priority
              className="rounded-full"
            />

            <div>
              <h1 className="text-sm font-black leading-tight text-white">
                Ugandan Society
                <br />
                <span className="text-yellow-400">in BC</span>
              </h1>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-2 text-[13px] lg:flex">
            <Link className="nav-link" href="/">Home</Link>
            <Link className="nav-link" href="/about">About</Link>
            <Link className="nav-link" href="/membership">Membership</Link>
            <Link className="nav-link" href="/events">Events</Link>
            <Link className="nav-link" href="/business-hub">Business Hub</Link>
            <Link className="nav-link" href="/partners">Partners</Link>

            <div className="group relative">
              <button className="nav-link py-8">Community ▼</button>

              <div className="invisible absolute left-0 top-full w-60 overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100">
                <Link href="/gallery" className="block px-5 py-4 font-bold hover:bg-yellow-50">Gallery</Link>
                <Link href="/resources" className="block px-5 py-4 font-bold hover:bg-yellow-50">Resources</Link>
                <Link href="/community-updates" className="block px-5 py-4 font-bold hover:bg-yellow-50">Community Updates</Link>
              </div>
            </div>

            <div className="group relative">
              <button className="nav-link py-8">Member ▼</button>

              <div className="invisible absolute right-0 top-full w-60 overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100">
                <Link href="/login" className="block px-5 py-4 font-bold hover:bg-yellow-50">Member Login</Link>
                <Link href="/admin/login" className="block px-5 py-4 font-bold hover:bg-yellow-50">Admin Login</Link>
                <Link href="/webmail" className="block px-5 py-4 font-bold hover:bg-yellow-50">Webmail</Link>
              </div>
            </div>
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/membership"
              className="hidden rounded-xl bg-yellow-400 px-5 py-3 font-black text-black shadow-lg transition hover:-translate-y-0.5 hover:bg-yellow-300 lg:block"
            >
              Join USBC
            </Link>

            <Link
              href="/donations"
              className="rounded-xl bg-red-600 px-5 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-red-700"
            >
              Donate
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl border border-white/20 px-4 py-3 text-xl font-black text-white lg:hidden"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-gray-950 px-6 py-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 font-bold text-white">
            <Link href="/" onClick={closeMenu}>Home</Link>
            <Link href="/about" onClick={closeMenu}>About</Link>
            <Link href="/membership" onClick={closeMenu}>Membership</Link>
            <Link href="/events" onClick={closeMenu}>Events</Link>
            <Link href="/business-hub" onClick={closeMenu}>Business Hub</Link>
            <Link href="/partners" onClick={closeMenu}>Partners</Link>
            <Link href="/gallery" onClick={closeMenu}>Gallery</Link>
            <Link href="/resources" onClick={closeMenu}>Resources</Link>
            <Link href="/community-updates" onClick={closeMenu}>Community Updates</Link>
            <Link href="/login" onClick={closeMenu}>Member Login</Link>
            <Link href="/admin/login" onClick={closeMenu}>Admin Login</Link>
            <Link href="/webmail" onClick={closeMenu}>Webmail</Link>

            <Link
              href="/membership"
              onClick={closeMenu}
              className="mt-3 rounded-xl bg-yellow-400 px-5 py-3 text-center font-black text-black"
            >
              Join USBC
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}