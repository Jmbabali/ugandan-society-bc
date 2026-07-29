"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type DropdownName = "community" | "member" | null;

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownName>(null);

  const headerRef = useRef<HTMLElement | null>(null);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdown: Exclude<DropdownName, null>) => {
    setOpenDropdown((current) =>
      current === dropdown ? null : dropdown,
    );
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 overflow-visible border-b border-white/10 bg-gray-950/95 shadow-lg backdrop-blur"
    >
      <div className="border-b border-white/10 bg-black/30 px-6 py-2 text-xs text-gray-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p>
            Building Connections • Preserving Heritage • Empowering Community
          </p>

          <p className="hidden md:block">
            info@ugandansocietybc.ca
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl overflow-visible px-6">
        <div className="flex h-20 items-center justify-between gap-6 overflow-visible">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 transition hover:opacity-90"
            onClick={closeMenus}
          >
            <Image
              src="/logo.png"
              alt="Ugandan Society in British Columbia logo"
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

          <nav className="hidden flex-1 items-center justify-center gap-2 overflow-visible text-[13px] lg:flex">
            <Link className="nav-link" href="/" onClick={closeMenus}>
              Home
            </Link>

            <Link
              className="nav-link"
              href="/about"
              onClick={closeMenus}
            >
              About
            </Link>

            <Link
              className="nav-link"
              href="/membership"
              onClick={closeMenus}
            >
              Membership
            </Link>

            <Link
              className="nav-link"
              href="/events"
              onClick={closeMenus}
            >
              Events
            </Link>

            <Link
              className="nav-link"
              href="/business-hub"
              onClick={closeMenus}
            >
              Business Hub
            </Link>

            <Link
              className="nav-link"
              href="/partners"
              onClick={closeMenus}
            >
              Partners
            </Link>

            {/* Community dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("community")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() => toggleDropdown("community")}
                onFocus={() => setOpenDropdown("community")}
                className="nav-link flex items-center gap-1 py-8"
                aria-expanded={openDropdown === "community"}
                aria-haspopup="true"
              >
                Community
                <span
                  className={`text-[10px] transition-transform ${
                    openDropdown === "community" ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              <div
                className={`absolute left-0 top-full z-[100] mt-1 w-60 overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-2xl transition-all duration-200 ${
                  openDropdown === "community"
                    ? "visible translate-y-0 opacity-100"
                    : "invisible pointer-events-none -translate-y-2 opacity-0"
                }`}
              >
                <Link
                  href="/gallery"
                  onClick={closeMenus}
                  className="block px-5 py-4 font-bold transition hover:bg-yellow-50"
                >
                  Gallery
                </Link>

                <Link
                  href="/resources"
                  onClick={closeMenus}
                  className="block border-t border-gray-100 px-5 py-4 font-bold transition hover:bg-yellow-50"
                >
                  Resources
                </Link>

                <Link
                  href="/community-updates"
                  onClick={closeMenus}
                  className="block border-t border-gray-100 px-5 py-4 font-bold transition hover:bg-yellow-50"
                >
                  Community Updates
                </Link>
              </div>
            </div>

            {/* Member dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("member")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() => toggleDropdown("member")}
                onFocus={() => setOpenDropdown("member")}
                className="nav-link flex items-center gap-1 py-8"
                aria-expanded={openDropdown === "member"}
                aria-haspopup="true"
              >
                Member
                <span
                  className={`text-[10px] transition-transform ${
                    openDropdown === "member" ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              <div
                className={`absolute right-0 top-full z-[100] mt-1 w-60 overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-2xl transition-all duration-200 ${
                  openDropdown === "member"
                    ? "visible translate-y-0 opacity-100"
                    : "invisible pointer-events-none -translate-y-2 opacity-0"
                }`}
              >
                <Link
                  href="/login"
                  onClick={closeMenus}
                  className="block px-5 py-4 font-bold transition hover:bg-yellow-50"
                >
                  Member Login
                </Link>

                <Link
                  href="/admin/login"
                  onClick={closeMenus}
                  className="block border-t border-gray-100 px-5 py-4 font-bold transition hover:bg-yellow-50"
                >
                  Admin Login
                </Link>

                <Link
                  href="/webmail"
                  onClick={closeMenus}
                  className="block border-t border-gray-100 px-5 py-4 font-bold transition hover:bg-yellow-50"
                >
                  Webmail
                </Link>
              </div>
            </div>
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/membership"
              onClick={closeMenus}
              className="hidden rounded-xl bg-yellow-400 px-5 py-3 font-black text-black shadow-lg transition hover:-translate-y-0.5 hover:bg-yellow-300 lg:block"
            >
              Join USBC
            </Link>

            <Link
              href="/donations"
              onClick={closeMenus}
              className="rounded-xl bg-red-600 px-5 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-red-700"
            >
              Donate
            </Link>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((current) => !current);
                setOpenDropdown(null);
              }}
              className="rounded-xl border border-white/20 px-4 py-3 text-xl font-black text-white lg:hidden"
              aria-label={
                mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-gray-950 px-6 py-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 font-bold text-white">
            <Link
              href="/"
              onClick={closeMenus}
              className="rounded-lg px-3 py-3 hover:bg-white/10"
            >
              Home
            </Link>

            <Link
              href="/about"
              onClick={closeMenus}
              className="rounded-lg px-3 py-3 hover:bg-white/10"
            >
              About
            </Link>

            <Link
              href="/membership"
              onClick={closeMenus}
              className="rounded-lg px-3 py-3 hover:bg-white/10"
            >
              Membership
            </Link>

            <Link
              href="/events"
              onClick={closeMenus}
              className="rounded-lg px-3 py-3 hover:bg-white/10"
            >
              Events
            </Link>

            <Link
              href="/business-hub"
              onClick={closeMenus}
              className="rounded-lg px-3 py-3 hover:bg-white/10"
            >
              Business Hub
            </Link>

            <Link
              href="/partners"
              onClick={closeMenus}
              className="rounded-lg px-3 py-3 hover:bg-white/10"
            >
              Partners
            </Link>

            <p className="mt-3 px-3 text-xs font-black uppercase tracking-widest text-yellow-400">
              Community
            </p>

            <Link
              href="/gallery"
              onClick={closeMenus}
              className="rounded-lg px-6 py-3 hover:bg-white/10"
            >
              Gallery
            </Link>

            <Link
              href="/resources"
              onClick={closeMenus}
              className="rounded-lg px-6 py-3 hover:bg-white/10"
            >
              Resources
            </Link>

            <Link
              href="/community-updates"
              onClick={closeMenus}
              className="rounded-lg px-6 py-3 hover:bg-white/10"
            >
              Community Updates
            </Link>

            <p className="mt-3 px-3 text-xs font-black uppercase tracking-widest text-yellow-400">
              Member
            </p>

            <Link
              href="/login"
              onClick={closeMenus}
              className="rounded-lg px-6 py-3 hover:bg-white/10"
            >
              Member Login
            </Link>

            <Link
              href="/admin/login"
              onClick={closeMenus}
              className="rounded-lg px-6 py-3 hover:bg-white/10"
            >
              Admin Login
            </Link>

            <Link
              href="/webmail"
              onClick={closeMenus}
              className="rounded-lg px-6 py-3 hover:bg-white/10"
            >
              Webmail
            </Link>

            <Link
              href="/membership"
              onClick={closeMenus}
              className="mt-4 rounded-xl bg-yellow-400 px-5 py-3 text-center font-black text-black"
            >
              Join USBC
            </Link>

            <Link
              href="/donations"
              onClick={closeMenus}
              className="rounded-xl bg-red-600 px-5 py-3 text-center font-black text-white"
            >
              Donate
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}