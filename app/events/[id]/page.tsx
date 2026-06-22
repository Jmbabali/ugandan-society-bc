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

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = Number(params.id);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="rounded-3xl bg-white p-8 font-bold shadow-xl">
          Loading event...
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
            Event Details
          </p>

          <h1 className="text-4xl font-black md:text-6xl">
            {event.title}
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-gray-300">
            Review the event details below and continue to registration.
          </p>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl bg-white shadow-premium">
            {event.poster_url ? (
              <img
                src={event.poster_url}
                alt={event.title}
                className="w-full"
              />
            ) : (
              <div className="flex h-96 items-center justify-center bg-gray-200 font-bold text-gray-500">
                No Event Poster
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-premium">
            <span className="mb-5 inline-block rounded-full bg-yellow-400 px-4 py-2 text-xs font-black uppercase text-black">
              {event.status}
            </span>

            <h2 className="mb-4 text-4xl font-black text-gray-950">
              {event.title}
            </h2>

            <p className="mb-8 text-lg text-gray-700">
              {event.description}
            </p>

            <div className="space-y-4 border-t pt-6 text-gray-700">
              <p>
                <strong>Date:</strong> {event.event_date}
              </p>

              <p>
                <strong>Time:</strong> {event.event_time}
              </p>

              <p>
                <strong>Location:</strong> {event.location}
              </p>

              <p>
                <strong>Register By:</strong>{" "}
                {event.registration_deadline}
              </p>
            </div>

            <div className="mt-8 grid gap-4">
              <Link
                href={`/events/${event.id}/register`}
                className="rounded-xl bg-gray-950 px-8 py-4 text-center font-bold text-white hover:bg-gray-800"
              >
                Continue to Registration
              </Link>

              <Link
                href="/events"
                className="rounded-xl border px-8 py-4 text-center font-bold text-gray-950 hover:bg-gray-50"
              >
                Back to Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}