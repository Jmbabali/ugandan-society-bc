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
  issue_date: string;
  expiry_date: string;
  photo_url: string | null;
};

function cleanMembershipType(type: string) {
  return type.replace(/\s*-\s*\$\d+.*$/, "");
}

export default function MemberCardPage() {
  const params = useParams();
  const id = params.id as string;

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMember() {
      const { data } = await supabase
        .from("Members")
        .select(
          "member_id, first_name, last_name, membership_type, member_category, issue_date, expiry_date, photo_url"
        )
        .eq("member_id", id)
        .maybeSingle();

      setMember(data);
      setLoading(false);
    }

    if (id) loadMember();
  }, [id]);

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="rounded-3xl bg-white p-8 font-bold shadow-xl">
          Loading Membership Card...
        </p>
      </main>
    );
  }

  if (!member) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="rounded-3xl bg-white p-8 font-bold shadow-xl">
          Member not found.
        </p>
      </main>
    );
  }

  const verificationUrl = `${window.location.origin}/verify?id=${member.member_id}`;
  const displayMembershipType = cleanMembershipType(member.membership_type || "");

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <style jsx global>{`
        @media print {
  @page {
    size: A4 portrait;
    margin: 8mm;
  }

  html,
  body {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
  }

  header,
  footer,
  nav,
  .no-print {
    display: none !important;
  }

  body * {
    visibility: hidden !important;
  }

  #print-card-area,
  #print-card-area * {
    visibility: visible !important;
  }

  #print-card-area {
    position: fixed !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    background: white !important;
  }

  #member-card {
    width: 120mm !important;
    max-width: 120mm !important;
    height: auto !important;
    max-height: none !important;
    box-shadow: none !important;
    border: 1px solid #111827 !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .print-header {
    padding: 24px !important;
    background: #111827 !important;
    color: white !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .print-body {
    padding: 30px !important;
  }

  .print-photo {
    width: 120px !important;
    height: 120px !important;
  }

  .print-name {
    font-size: 34px !important;
  }

  .print-qr {
    width: 170px !important;
    height: 170px !important;
  }
}
      `}</style>

      <div id="print-card-area" className="flex justify-center">
        <div
          id="member-card"
          className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border bg-white shadow-2xl"
        >
          <div className="print-header bg-gray-950 px-6 py-6 text-center text-white">
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white p-2 print-logo">
              <Image
                src="/logo.png"
                alt="USBC Logo"
                width={70}
                height={70}
                priority
              />
            </div>

            <h1 className="print-title text-2xl font-black">
              Ugandan Society in BC
            </h1>

            <p className="print-subtitle text-sm text-gray-300">
              Building Connections • Preserving Heritage
            </p>
          </div>

          <div className="print-body p-8 text-center">
            {member.photo_url ? (
              <img
                src={member.photo_url}
                alt={`${member.first_name} ${member.last_name}`}
                className="print-photo mx-auto h-32 w-32 rounded-full border-4 border-yellow-400 object-cover"
              />
            ) : (
              <div className="print-photo mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gray-200 text-3xl font-black text-gray-500">
                {member.first_name?.[0]}
                {member.last_name?.[0]}
              </div>
            )}

            <h2 className="print-name mt-6 text-3xl font-black text-gray-950">
              {member.first_name} {member.last_name}
            </h2>

            <p className="print-category mt-2 text-gray-600">
              {member.member_category}
            </p>

            <div className="print-details mt-8 grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="print-label text-xs font-bold uppercase text-gray-500">
                  Member ID
                </p>
                <p className="print-value font-bold text-gray-950">
                  {member.member_id}
                </p>
              </div>

              <div>
                <p className="print-label text-xs font-bold uppercase text-gray-500">
                  Membership
                </p>
                <p className="print-value font-bold text-gray-950">
                  {displayMembershipType}
                </p>
              </div>

              <div>
                <p className="print-label text-xs font-bold uppercase text-gray-500">
                  Issued
                </p>
                <p className="print-value font-bold text-gray-950">
                  {member.issue_date}
                </p>
              </div>

              <div>
                <p className="print-label text-xs font-bold uppercase text-gray-500">
                  Expires
                </p>
                <p className="print-value font-bold text-gray-950">
                  {member.expiry_date}
                </p>
              </div>
            </div>

            <div className="print-qr-box mt-8 rounded-2xl bg-gray-100 p-5">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                  verificationUrl
                )}`}
                alt="QR Code"
                className="print-qr mx-auto"
              />

              <p className="print-qr-text mt-4 text-sm font-bold text-gray-950">
                Scan to Verify Membership
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="no-print mx-auto mt-8 flex max-w-md gap-4">
        <button
          onClick={handlePrint}
          className="w-full rounded-xl bg-gray-950 px-6 py-4 font-bold text-white hover:bg-gray-800"
        >
          Download / Print Card
        </button>
      </div>
    </main>
  );
}