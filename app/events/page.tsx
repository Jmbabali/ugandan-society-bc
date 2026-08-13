"use client";

import { useEffect, useState } from "react";
import EventCard, { type EventSummary } from "@/app/components/EventCard";
import { supabase } from "@/lib/supabase";

export default function EventsPage() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      const { data, error } = await supabase
        .from("Events")
        .select(
          "id, title, location, event_date, event_time, event_link, poster_url"
        )
        .eq("status", "Open")
        .order("event_date", { ascending: true });

      if (!error && data) setEvents(data);
      setLoading(false);
    }

    void loadEvents();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gray-950 px-6 pb-16 pt-32 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 font-bold uppercase tracking-widest text-yellow-400">
            Events
          </p>

          <h1 className="mb-4 text-4xl font-black md:text-6xl">
            Upcoming Events
          </h1>

          <p className="max-w-3xl text-lg text-gray-300">
            Select an event poster to see complete details and registration
            information.
          </p>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <p className="rounded-3xl bg-white p-8 text-center font-bold text-gray-700 shadow-premium">
              Loading upcoming events...
            </p>
          ) : events.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow-premium">
              <h2 className="mb-3 text-3xl font-black text-gray-950">
                No upcoming events
              </h2>

              <p className="text-gray-700">
                Upcoming USBC events will appear here once published.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
