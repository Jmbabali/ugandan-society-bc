"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const memberId = searchParams.get("member");

  const [message, setMessage] = useState("Confirming your payment...");

  useEffect(() => {
    async function updatePayment() {
      if (!memberId) {
        setMessage("Payment completed, but no member ID was found.");
        return;
      }

      const { data, error } = await supabase
        .from("Members")
        .update({
          payment_status: "Paid",
          payment_method: "Stripe",
          payment_date: new Date().toISOString(),
        })
        .eq("member_id", memberId)
        .select();

      if (error) {
        setMessage(`Update failed: ${error.message}`);
        return;
      }

      if (!data || data.length === 0) {
        setMessage(`No member found with ID: ${memberId}`);
        return;
      }

      setMessage(
        `Payment confirmed successfully for ${memberId}. Your membership application is now pending USBC approval.`
      );
    }

    updatePayment();
  }, [memberId]);

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-20">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-premium">
        <p className="mb-4 font-bold uppercase tracking-widest text-green-700">
          Payment Status
        </p>

        <h1 className="mb-6 text-4xl font-black text-gray-950">
          Membership Payment
        </h1>

        <p className="mb-8 text-lg font-bold text-gray-700">{message}</p>

        <Link
          href="/"
          className="inline-block rounded-xl bg-gray-950 px-8 py-4 font-bold text-white hover:bg-gray-800"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}