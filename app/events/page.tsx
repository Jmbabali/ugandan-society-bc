"use client";

import { useEffect, useState } from "react";
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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    const { data, error } = await supabase
      .from("Events")
      .select("*")
      .eq("status", "Open")
      .order("event_date", { ascending: true });

    if (!error && data) {
      setEvents(data);
    }
  }

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
            Discover upcoming USBC events and register your interest as a member
            or community participant.
          </p>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-black text-gray-950">
                All Upcoming Events
              </h2>

              <p className="mt-2 text-gray-600">
                Stay connected and join us at our next events.
              </p>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow-premium">
              <h2 className="mb-3 text-3xl font-black text-gray-950">
                No upcoming events
              </h2>

              <p className="text-gray-700">
                Upcoming USBC events will appear here once published.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="overflow-hidden rounded-3xl border bg-white shadow-premium"
                >
                  {event.poster_url ? (
                    <img
                      src={event.poster_url}
                      alt={event.title}
                      className="h-auto w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-80 w-full items-center justify-center bg-gray-200 font-bold text-gray-500">
                      No Event Poster
                    </div>
                  )}

                  <div className="p-6">
                    <span className="mb-4 inline-block rounded-full bg-yellow-400 px-4 py-2 text-xs font-black uppercase text-black">
                      {event.status}
                    </span>

                    <h2 className="mb-2 text-3xl font-black text-gray-950">
                      {event.title}
                    </h2>

                    <p className="mb-5 text-gray-700">{event.description}</p>

                    <div className="border-t pt-5">
                      <div className="space-y-3 text-gray-700">
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
                    </div>

                    <a
                      href={`/events/${event.id}`}
                      className="mt-6 block rounded-xl bg-gray-950 px-6 py-4 text-center font-bold text-white hover:bg-gray-800"
                    >
                      Register Now →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}