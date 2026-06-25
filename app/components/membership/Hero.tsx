"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";

export default function MembershipHero() {
  return (
    <section className="relative min-h-[650px] overflow-hidden text-white">

      <Image
        src="/home/community-3.jpg"
        alt="USBC Membership"
        fill
        priority
        sizes="100vw"
        className="object-cover hero-zoom"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

      <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-6">

        <div className="max-w-3xl fade-up">

          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-5 py-3 backdrop-blur">

            <BadgeCheck className="h-6 w-6 text-yellow-400" />

            <span className="font-black uppercase tracking-widest text-yellow-400">
              USBC Membership
            </span>

          </div>

          <h1 className="mb-8 text-5xl font-black leading-tight md:text-7xl">
            Become Part of British Columbia's Ugandan Community
          </h1>

          <p className="mb-10 max-w-2xl text-xl leading-8 text-gray-200">
            Join a vibrant community dedicated to preserving Ugandan culture,
            supporting newcomers, empowering professionals, strengthening
            businesses, and creating lasting friendships throughout British Columbia.
          </p>

          <div className="flex flex-wrap gap-4">

            <Link
              href="#application"
              className="rounded-xl bg-yellow-400 px-8 py-4 font-black text-black transition hover:bg-yellow-300"
            >
              Apply Now
            </Link>

            <Link
              href="#plans"
              className="rounded-xl border border-white/40 bg-white/10 px-8 py-4 font-black backdrop-blur transition hover:bg-white hover:text-black"
            >
              View Membership Plans
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}