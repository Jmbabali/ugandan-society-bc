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
  issue_date: string;
  expiry_date: string;
  photo_url: string | null;
};

function cleanMembershipType(type: string) {
  return type?.replace(/\s*-\s*\$\d+.*$/, "") || "";
}

function formatDate(value: string) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
}

function isExpired(value: string) {
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

  const expired = isExpired(member.expiry_date);
  const active = member.status === "Approved" && !expired;
  const verificationUrl = `${origin}/verify?id=${member.member_id}`;
  const displayMembershipType = cleanMembershipType(
    member.membership_type || ""
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#1f2937_0%,#111827_35%,#000000_100%)] px-6 py-10">
      <style jsx global>{`
  @media print {
    @page {
  size: portrait;
  margin: 0;
}

@media print {

  html,
  body {
    width: 100%;
    height: 100%;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
  }

  #print-card-area {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    width: 100vw !important;
    height: 100vh !important;

    .card-footer,
.card-footer * {
  display: block !important;
  visibility: visible !important;
  color: #6b7280 !important;
}
  }

  #member-card {
    width: 90mm !important;
    height: 140mm !important;
    transform: none !important;
    page-break-inside: avoid !important;
  }
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
      width: 100mm !important;
      height: 180mm !important;
      max-width: 100mm !important;
      max-height: 180mm !important;
      overflow: hidden !important;
      box-shadow: none !important;
      border: 1px solid #111827 !important;
      border-radius: 10mm !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    .print-bg {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    #member-card h1 {
      font-size: 26px !important;
      line-height: 1.1 !important;
    }

    #member-card img {
      object-fit: cover !important;
    }

    #member-card .qr-print {
      width: 120px !important;
      height: 120px !important;
    }

    #member-card p {
      line-height: 1.25 !important;
    }
  }
`}</style>

      <div className="no-print mx-auto mb-8 max-w-md text-center text-white">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-yellow-400">
          USBC Digital Membership
        </p>
        <h1 className="mt-3 text-4xl font-black">Member Card</h1>
        <p className="mt-3 text-gray-300">
          Save, print, or scan the QR code to verify membership status.
        </p>
      </div>

      <div
  id="print-card-area"
  className="mx-auto flex min-h-screen items-center justify-center px-4 py-8"
>
        <div
          id="member-card"
         className="relative mx-auto w-full max-w-[390px] min-h-[760px] overflow-hidden rounded-[32px] bg-white shadow-[0_25px_70px_rgba(0,0,0,0.35)] ring-1 ring-black/10"
        >
          <div className="print-bg h-3 bg-gradient-to-r from-black via-yellow-400 to-red-600" />
          <div className="h-1 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300" />

          <div className="print-bg bg-gray-950 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2">
                  <Image
                    src="/logo.png"
                    alt="USBC Logo"
                    width={58}
                    height={58}
                    priority
                  />
                </div>

                <div>
                  <p className="text-lg font-black uppercase tracking-widest text-yellow-400">
                    Ugandan Society
                  </p>
                  <h2 className="text-3xl font-black leading-tight">in BC</h2>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  active
                    ? "bg-green-400 text-green-950"
                    : "bg-red-500 text-white"
                }`}
              >
                {active ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>

            <div className="mt-5">
              <p className="text-m font-bold uppercase tracking-widest text-gray-400">
                Digital Membership Card
              </p>

              <h1 className="mt-3 text-5xl font-black leading-tight">
                {member.first_name} {member.last_name}
              </h1>

              <p className="mt-2 text-yellow-400">
                {member.member_category || "USBC Member"}
              </p>
            </div>
          </div>

          <div className="p-7">
            <div className="flex items-center gap-5">
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={`${member.first_name} ${member.last_name}`}
                  className="h-30 w-30 rounded-3xl border-4 border-yellow-400 object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gray-200 text-4xl font-black text-gray-500">
                  {member.first_name?.[0]}
                  {member.last_name?.[0]}
                </div>
              )}

              <div className="flex-1">
                <p className="text-xs font-bold uppercase text-gray-500">
                  Member ID
                </p>
                <p className="text-2xl font-black text-gray-950">
                  {member.member_id}
                </p>

                <p className="mt-3 text-xs font-bold uppercase text-gray-500">
                  Membership
                </p>
                <p className="font-black text-gray-950">
                  {displayMembershipType || "Member"}
                </p>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <InfoBox label="Issued" value={formatDate(member.issue_date)} />
              <InfoBox label="Expires" value={formatDate(member.expiry_date)} />
              <InfoBox label="Status" value={active ? "Active" : "Inactive"} />
              <InfoBox
                label="Category"
                value={member.member_category || "Member"}
              />
            </div>

            <div className="mt-2 rounded-xl bg-gray-100 p-2 text-center">
              {origin && (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                    verificationUrl
                  )}`}
                  alt="QR Code"
                  className="qr-print mx-auto h-24 w-24"
                />
              )}

              <p className="mt-1 text-[11px] font-semibold text-gray-700">
                Scan to Verify Membership
              </p>

            </div>
          </div>
        </div>
      </div>

      <div className="no-print mx-auto mt-5 flex max-w-md gap-4">
        <button
          onClick={handlePrint}
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
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-xs font-bold uppercase text-gray-500">{label}</p>
      <p className="mt-1 font-black text-gray-950">{value || "N/A"}</p>
    </div>
  );
}
