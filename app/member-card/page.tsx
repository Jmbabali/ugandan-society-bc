"use client";

import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";

export default function MemberCardPage() {
  const memberId = "USBC-0001";
  const verificationUrl = `http://192.168.1.95:3000/verify?id=${memberId}`;

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
            Digital Membership ID
          </p>

          <h1 className="text-4xl font-black text-gray-950 md:text-5xl">
            USBC Digital Member Card
          </h1>
        </div>

        <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 text-white shadow-2xl">
          <div className="flex items-center gap-4 bg-yellow-400 px-6 py-4 text-black">
            <Image src="/logo.png" alt="USBC Logo" width={60} height={60} />

            <div>
              <h2 className="text-lg font-black">Ugandan Society in BC</h2>
              <p className="text-sm font-semibold">Official Membership Card</p>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6 flex justify-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-800 text-4xl font-black text-yellow-400">
                JM
              </div>
            </div>

            <p className="mb-2 text-center text-sm uppercase tracking-widest text-gray-400">
              Member Name
            </p>

            <h3 className="mb-8 text-center text-3xl font-black">
              John Mbabali
            </h3>

            <div className="mb-8 grid grid-cols-2 gap-5">
              <div>
                <p className="text-xs uppercase text-gray-400">Member ID</p>
                <p className="font-bold">{memberId}</p>
              </div>

              <div>
                <p className="text-xs uppercase text-gray-400">
                  Membership Type
                </p>
                <p className="font-bold">Individual</p>
              </div>

              <div>
                <p className="text-xs uppercase text-gray-400">Status</p>
                <p className="font-bold text-yellow-400">Active</p>
              </div>

              <div>
                <p className="text-xs uppercase text-gray-400">Expiry Date</p>
                <p className="font-bold">Dec 31, 2026</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 text-center text-black">
              <div className="mb-4 flex justify-center">
                <QRCodeCanvas value={verificationUrl} size={160} />
              </div>

              <p className="text-sm font-bold">Scan to Verify Membership</p>

              <p className="mt-2 break-all text-xs text-gray-500">
                {verificationUrl}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}