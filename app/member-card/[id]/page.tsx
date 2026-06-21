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
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadMember() {
      try {
        setLoading(true);
        setErrorMessage("");

        const { data, error } = await supabase
          .from("Members")
          .select(
            "member_id, first_name, last_name, membership_type, member_category, issue_date, expiry_date, photo_url"
          )
          .eq("member_id", id)
          .maybeSingle();

        if (error) {
          console.error("Member card error:", error);
          setErrorMessage(error.message);
          setMember(null);
          return;
        }

        setMember(data);
      } catch (error: any) {
        console.error("Unexpected member card error:", error);
        setErrorMessage(error?.message || "Could not load member card.");
        setMember(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadMember();
    }
  }, [id]);

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-yellow-400"></div>
          <p className="font-bold text-gray-950">Loading Membership Card...</p>
        </div>
      </main>
    );
  }

  if (!member) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
        <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-3xl font-black text-red-600">
            Member Not Found
          </h1>

          <p className="mt-4 text-gray-700">
            No approved member card was found for:
          </p>

          <p className="mt-2 font-bold text-gray-950">{id}</p>

          {errorMessage && (
            <p className="mt-4 rounded-xl bg-red-100 p-4 text-sm font-bold text-red-700">
              {errorMessage}
            </p>
          )}
        </div>
      </main>
    );
  }

  const verificationUrl = `http://192.168.1.95:3000/verify?id=${member.member_id}`;
  const displayMembershipType = cleanMembershipType(member.membership_type || "");

  return (
    <main className="screen-page min-h-screen bg-gray-100 px-6 py-10">
      <div id="print-page" className="flex justify-center">
        <div
          id="member-card"
          className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border bg-white shadow-2xl"
        >
          <div className="card-header bg-gray-950 px-6 py-6 text-center text-white">
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white p-2">
              <Image
                src="/logo.png"
                alt="USBC Logo"
                width={70}
                height={70}
                priority
              />
            </div>

            <h1 className="text-2xl font-black">Ugandan Society in BC</h1>

            <p className="text-sm text-gray-300">
              Building Connections • Preserving Heritage
            </p>
          </div>

          <div className="p-8 text-center">
            {member.photo_url ? (
              <img
                src={member.photo_url}
                alt={`${member.first_name} ${member.last_name}`}
                className="mx-auto h-32 w-32 rounded-full border-4 border-yellow-400 object-cover"
              />
            ) : (
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gray-200 text-3xl font-black text-gray-500">
                {member.first_name?.[0]}
                {member.last_name?.[0]}
              </div>
            )}

            <h2 className="mt-6 text-3xl font-black text-gray-950">
              {member.first_name} {member.last_name}
            </h2>

            <p className="mt-2 text-gray-600">{member.member_category}</p>

            <div className="mt-8 grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-xs font-bold uppercase text-gray-500">
                  Member ID
                </p>
                <p className="font-bold text-gray-950">{member.member_id}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-gray-500">
                  Membership
                </p>
                <p className="font-bold text-gray-950">
                  {displayMembershipType}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-gray-500">
                  Issued
                </p>
                <p className="font-bold text-gray-950">{member.issue_date}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-gray-500">
                  Expires
                </p>
                <p className="font-bold text-gray-950">{member.expiry_date}</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-gray-100 p-5">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                  verificationUrl
                )}`}
                alt="QR Code"
                className="mx-auto"
              />

              <p className="mt-4 text-sm font-bold text-gray-950">
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
          Download Card
        </button>

        <button
          onClick={handlePrint}
          className="w-full rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black hover:bg-yellow-300"
        >
          Print Card
        </button>
      </div>
    </main>
  );
}