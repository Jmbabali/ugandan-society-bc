"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";
import { supabase } from "@/lib/supabase";

type Member = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  payment_status: string | null;
};

export default function AdminEmailPage() {
  const router = useRouter();

  const EMAILJS_SERVICE_ID = "service_ubqt8tr";
  const EMAILJS_TEMPLATE_ID = "template_dkreqpv";
  const EMAILJS_PUBLIC_KEY = "5fuwosM5RJCHTr9v2";

  const [members, setMembers] = useState<Member[]>([]);
  const [recipientGroup, setRecipientGroup] = useState("All Members");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("usbc_admin_logged_in");

    if (isLoggedIn !== "true") {
      router.push("/admin/login");
      return;
    }

    setCheckingLogin(false);
    loadMembers();
  }, [router]);

  async function loadMembers() {
    const { data, error } = await supabase
      .from("Members")
      .select("id, first_name, last_name, email, status, payment_status")
      .order("id", { ascending: false });

    if (error) {
      setStatusMessage(error.message);
      return;
    }

    setMembers(data || []);
  }

  const filteredRecipients = members.filter((member) => {
    if (!member.email) return false;

    if (recipientGroup === "Approved Members") return member.status === "Approved";
    if (recipientGroup === "Paid Members") return member.payment_status === "Paid";
    if (recipientGroup === "Unpaid Members") return member.payment_status !== "Paid";
    if (recipientGroup === "Pending Members") return member.status === "Pending";

    return true;
  });

  async function sendBroadcastEmail(e: React.FormEvent) {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      setStatusMessage("Please enter both subject and message.");
      return;
    }

    if (filteredRecipients.length === 0) {
      setStatusMessage("No recipients found for this group.");
      return;
    }

    const confirmed = window.confirm(
      `Send this email to ${filteredRecipients.length} recipient(s)?`
    );

    if (!confirmed) return;

    setSending(true);
    setStatusMessage("Sending emails...");

    let successCount = 0;
    let failCount = 0;

    for (const member of filteredRecipients) {
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: member.email,
            member_name: `${member.first_name} ${member.last_name}`,
            subject,
            message,
          },
          EMAILJS_PUBLIC_KEY
        );

        successCount += 1;
      } catch {
        failCount += 1;
      }
    }

    setSending(false);
    setStatusMessage(
      `Email broadcast complete. Sent: ${successCount}. Failed: ${failCount}.`
    );
  }

  if (checkingLogin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
        <p className="rounded-3xl bg-white p-8 font-bold text-gray-950 shadow-xl">
          Checking admin access...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
            USBC Admin
          </p>

          <h1 className="text-4xl font-black text-gray-950 md:text-6xl">
            Email Broadcast
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-gray-700">
            Send announcements, updates, event notices, payment reminders, and
            membership notices to USBC members.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-5">
          <div className="rounded-3xl border bg-white p-6 shadow-premium">
            <p className="text-sm font-bold uppercase text-gray-500">
              All Members
            </p>
            <p className="mt-2 text-4xl font-black text-gray-950">
              {members.length}
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-premium">
            <p className="text-sm font-bold uppercase text-gray-500">
              Approved
            </p>
            <p className="mt-2 text-4xl font-black text-green-700">
              {members.filter((member) => member.status === "Approved").length}
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-premium">
            <p className="text-sm font-bold uppercase text-gray-500">Paid</p>
            <p className="mt-2 text-4xl font-black text-gray-950">
              {members.filter((member) => member.payment_status === "Paid").length}
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-premium">
            <p className="text-sm font-bold uppercase text-gray-500">Unpaid</p>
            <p className="mt-2 text-4xl font-black text-red-600">
              {members.filter((member) => member.payment_status !== "Paid").length}
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-premium">
            <p className="text-sm font-bold uppercase text-gray-500">
              Recipients
            </p>
            <p className="mt-2 text-4xl font-black text-red-600">
              {filteredRecipients.length}
            </p>
          </div>
        </div>

        <form
          onSubmit={sendBroadcastEmail}
          className="rounded-3xl border bg-white p-8 shadow-premium"
        >
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold uppercase text-gray-500">
              Recipient Group
            </label>

            <select
              value={recipientGroup}
              onChange={(e) => setRecipientGroup(e.target.value)}
              className="w-full rounded-xl border px-4 py-4 text-gray-950"
            >
              <option>All Members</option>
              <option>Approved Members</option>
              <option>Paid Members</option>
              <option>Unpaid Members</option>
              <option>Pending Members</option>
            </select>

            <p className="mt-2 text-sm font-bold text-gray-600">
              This email will be sent to {filteredRecipients.length} recipient(s).
            </p>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold uppercase text-gray-500">
              Email Subject
            </label>

            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Example: USBC Community Update"
              className="w-full rounded-xl border px-4 py-4 text-gray-950"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold uppercase text-gray-500">
              Message
            </label>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              className="h-64 w-full rounded-xl border px-4 py-4 text-gray-950"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-xl bg-gray-950 px-8 py-4 font-bold text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send Broadcast Email"}
          </button>

          {statusMessage && (
            <p className="mt-6 rounded-xl bg-yellow-100 p-4 font-bold text-gray-950">
              {statusMessage}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}