"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Member = {
  member_id: string;
  first_name: string;
  last_name: string;
  membership_type: string;
  member_category: string;
  status: string;
  issue_date: string | null;
  expiry_date: string | null;
  photo_url: string | null;
};

function cleanMembershipType(type: string) {
  return type?.replace(/\s*-\s*\$\d+.*$/, "") || "";
}

function formatDate(value: string | null) {
  if (!value) return "N/A";
  return value.split("T")[0];
}

function isExpired(value: string | null) {
  if (!value) return false;
  return new Date(value) < new Date();
}

export default function MemberCardPage() {
  const params = useParams();
  const id = params.id as string;

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);

    async function loadMember() {
      const { data } = await supabase
        .from("Members")
        .select(
          "member_id, first_name, last_name, membership_type, member_category, status, issue_date, expiry_date, photo_url"
        )
        .eq("member_id", id)
        .maybeSingle();

      setMember(data);
      setLoading(false);
    }

    if (id) loadMember();
  }, [id]);

  if (loading) {
    return (
      <main className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <p className="rounded-2xl bg-gray-100 p-6 font-bold">
          Loading Membership Card...
        </p>
      </main>
    );
  }

  if (!member) {
    return (
      <main className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <p className="rounded-2xl bg-gray-100 p-6 font-bold">
          Member not found.
        </p>
      </main>
    );
  }

  const active = member.status === "Approved" && !isExpired(member.expiry_date);
  const verificationUrl = `${origin}/verify?id=${member.member_id}`;
  const displayMembershipType = cleanMembershipType(member.membership_type);

  return (
    <main className="fixed inset-0 z-[9999] overflow-auto bg-white">
      <style jsx global>{`
        header,
        footer,
        nav,
        .site-header,
        .site-footer {
          display: none !important;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: hidden !important;
          }

          body * {
            visibility: hidden !important;
          }

          .no-print {
            display: none !important;
          }

          #print-area,
          #print-area * {
            visibility: visible !important;
          }

          #print-area {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
          #member-card {
            width: 88mm !important;
            height: 190mm !important;
            box-shadow: none !important;
            border: 1px solid #111827 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
            transform: scale(0.9) !important;
            transform-origin: center center !important;
          }

          .print-bg {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div
        id="print-area"
        className="flex min-h-screen items-center justify-center bg-white px-4 py-10"
      >
        <div
          id="member-card"
          className="h-[740px] w-[370px] overflow-hidden rounded-[30px] border border-gray-900 bg-white shadow-2xl"
        >
          <div className="print-bg h-3 bg-gradient-to-r from-black via-yellow-400 to-red-600" />

          <div className="print-bg bg-gray-950 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2">
                  <Image src="/logo.png" alt="USBC Logo" width={48} height={48} priority />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-yellow-400">
                    Ugandan Society
                  </p>
                  <h2 className="text-2xl font-black leading-none">in BC</h2>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  active ? "bg-green-400 text-green-950" : "bg-red-500 text-white"
                }`}
              >
                {active ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-widest text-gray-400">
              Digital Membership Card
            </p>

            <h1 className="mt-2 text-3xl font-black leading-tight">
              {member.first_name} {member.last_name}
            </h1>

            <p className="mt-1 text-sm font-semibold text-yellow-400">
              {member.member_category || "USBC Member"}
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-4">
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={`${member.first_name} ${member.last_name}`}
                  className="h-24 w-24 rounded-3xl border-4 border-yellow-400 object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gray-200 text-3xl font-black text-gray-500">
                  {member.first_name?.[0]}
                  {member.last_name?.[0]}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase text-gray-500">Member ID</p>
                <p className="break-words text-xl font-black text-gray-950">
                  {member.member_id}
                </p>

                <p className="mt-2 text-xs font-bold uppercase text-gray-500">
                  Membership
                </p>
                <p className="font-black text-gray-950">
                  {displayMembershipType || "Member"}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <InfoBox label="Issued" value={formatDate(member.issue_date)} />
              <InfoBox label="Expires" value={formatDate(member.expiry_date)} />
              <InfoBox label="Status" value={active ? "Active" : "Inactive"} />
              <InfoBox label="Category" value={member.member_category || "Member"} />
            </div>

            <div className="mt-4 rounded-xl bg-gray-100 p-3 text-center">
              {origin && (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(
                    verificationUrl
                  )}`}
                  alt="QR Code"
                  className="mx-auto h-24 w-24"
                />
              )}

              <p className="mt-1 text-[10px] font-bold text-gray-700">
                Scan to Verify Membership
              </p>
            </div>

            <p className="mt-3 border-t pt-3 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Building Connections • Preserving Heritage
            </p>
          </div>
        </div>
      </div>

      <div className="no-print mx-auto mb-10 flex max-w-sm px-4">
        <button
          onClick={() => window.print()}
          className="w-full rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black hover:bg-yellow-300"
        >
          Download / Print Card
        </button>
      </div>
    </main>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-3">
      <p className="text-[10px] font-bold uppercase text-gray-500">{label}</p>
      <p className="mt-1 font-black text-gray-950">{value || "N/A"}</p>
    </div>
  );
}