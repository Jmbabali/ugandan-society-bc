"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Event = {
  id: number;
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_time: string;
  registration_deadline: string;
  status: string;
  poster_url: string | null;
};

export default function EventRegisterPage() {
  const params = useParams();
  const eventId = Number(params.id);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    memberId: "",
    memberName: "",
    memberEmail: "",
  });

  useEffect(() => {
    loadEvent();
  }, []);

  async function loadEvent() {
    const { data, error } = await supabase
      .from("Events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (error) {
      setMessage("Event not found.");
      setLoading(false);
      return;
    }

    setEvent(data);
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function registerForEvent(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("Submitting registration...");

    const { error } = await supabase.from("EventRegistrations").insert({
      event_id: eventId,
      member_id: form.memberId,
      member_name: form.memberName,
      member_email: form.memberEmail,
      registration_date: new Date().toISOString(),
      status: "Registered",
    });

    if (error) {
      setMessage(error.message);
      setSubmitting(false);
      return;
    }

    setMessage("Registration submitted successfully.");

    setForm({
      memberId: "",
      memberName: "",
      memberEmail: "",
    });

    setSubmitting(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="rounded-3xl bg-white p-8 font-bold shadow-xl">
          Loading registration...
        </p>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-gray-100 px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-premium">
          <h1 className="mb-4 text-4xl font-black text-gray-950">
            Event Not Found
          </h1>

          <p className="mb-8 text-gray-700">{message}</p>

          <Link
            href="/events"
            className="inline-block rounded-xl bg-gray-950 px-8 py-4 font-bold text-white"
          >
            Back to Events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gray-950 px-6 pb-16 pt-32 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 font-bold uppercase tracking-widest text-yellow-400">
            Event Registration
          </p>

          <h1 className="text-4xl font-black md:text-6xl">{event.title}</h1>

          <p className="mt-4 max-w-3xl text-lg text-gray-300">
            Complete the form below to register for this event.
          </p>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl bg-white shadow-premium">
            {event.poster_url ? (
              <img src={event.poster_url} alt={event.title} className="w-full" />
            ) : (
              <div className="flex h-96 items-center justify-center bg-gray-200 font-bold text-gray-500">
                No Event Poster
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-premium">
            <h2 className="mb-4 text-3xl font-black text-gray-950">
              Register Now
            </h2>

            <div className="mb-6 space-y-2 border-b pb-6 text-gray-700">
              <p>
                <strong>Date:</strong> {event.event_date}
              </p>
              <p>
                <strong>Time:</strong> {event.event_time}
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
            </div>

            <form onSubmit={registerForEvent} className="space-y-5">
              <input
                name="memberId"
                value={form.memberId}
                onChange={handleChange}
                placeholder="Member ID, e.g. USBC-0008"
                className="w-full rounded-xl border px-4 py-4 text-gray-950"
              />

              <input
                name="memberName"
                value={form.memberName}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full rounded-xl border px-4 py-4 text-gray-950"
              />

              <input
                name="memberEmail"
                value={form.memberEmail}
                onChange={handleChange}
                required
                type="email"
                placeholder="Email Address"
                className="w-full rounded-xl border px-4 py-4 text-gray-950"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gray-950 px-8 py-4 font-bold text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Registration"}
              </button>

              {message && (
                <p className="rounded-xl bg-yellow-100 p-4 font-bold text-gray-950">
                  {message}
                </p>
              )}
            </form>

            <Link
              href={`/events/${event.id}`}
              className="mt-5 block text-center font-bold text-gray-700 hover:text-gray-950"
            >
              Back to Event Details
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}