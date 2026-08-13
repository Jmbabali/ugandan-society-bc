"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import EventCard, { type EventSummary } from "./EventCard";

export default function UpcomingEvents() {
  const [events, setEvents] = useState<EventSummary[]>([]);

  useEffect(() => {
    async function loadUpcomingEvents() {
      const { data, error } = await supabase
        .from("Events")
        .select(
          "id, title, location, event_date, event_time, event_link, poster_url"
        )
        .eq("status", "Open")
        .order("event_date", { ascending: true })
        .limit(3);

      if (error) {
        console.error("Upcoming events error:", error.message);
        return;
      }

      setEvents(data || []);
    }

    void loadUpcomingEvents();
  }, []);

  if (events.length === 0) return null;

  return (
    <section className="bg-slate-100 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-4 font-black uppercase tracking-[0.3em] text-red-600">
            Upcoming Events
          </p>

          <h2 className="mb-6 text-4xl font-black text-gray-950 md:text-5xl">
            Join Us at Our Next Event
          </h2>

          <p className="text-lg leading-8 text-gray-600">
            See what is coming up and select a poster for full event details.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/events"
            className="inline-block rounded-xl bg-red-600 px-8 py-4 font-black text-white transition hover:bg-red-700"
          >
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
}
