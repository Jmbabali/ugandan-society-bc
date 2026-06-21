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
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [message, setMessage] = useState("");
  const [registeringEventId, setRegisteringEventId] = useState<number | null>(
    null
  );

  const [registrationForm, setRegistrationForm] = useState({
    member_id: "",
    member_name: "",
    member_email: "",
  });

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    const { data, error } = await supabase
      .from("Events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) {
      setMessage(error.message);
      return;
    }

    setEvents(data || []);
  }

  function handleRegistrationChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRegistrationForm({
      ...registrationForm,
      [e.target.name]: e.target.value,
    });
  }

  async function registerForEvent(eventId: number) {
    setMessage("Submitting registration...");

    const { error } = await supabase.from("EventRegistrations").insert({
      event_id: eventId,
      member_id: registrationForm.member_id,
      member_name: registrationForm.member_name,
      member_email: registrationForm.member_email,
      registration_date: new Date().toISOString(),
      status: "Registered",
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Event registration submitted successfully.");
    setRegisteringEventId(null);
    setRegistrationForm({
      member_id: "",
      member_name: "",
      member_email: "",
    });
  }

  const visibleEvents = events.filter((event) => event.status !== "Hidden");

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gray-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 font-bold uppercase tracking-widest text-yellow-400">
            Events
          </p>

          <h1 className="mb-6 max-w-5xl text-4xl font-black md:text-6xl">
            Bringing the Community Together
          </h1>

          <p className="max-w-3xl text-lg text-gray-300 md:text-xl">
            USBC events create opportunities for cultural celebration,
            networking, learning, family engagement, sports, and community
            connection across British Columbia.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
              Upcoming Events
            </p>

            <h2 className="mb-4 text-3xl font-black text-gray-950 md:text-5xl">
              Register for USBC Events
            </h2>

            <p className="text-lg text-gray-700">
              Browse upcoming USBC events and register your interest as a
              member or community participant.
            </p>
          </div>

          {message && (
            <p className="mb-8 rounded-xl bg-yellow-100 p-4 font-bold text-gray-950">
              {message}
            </p>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-3xl border bg-white p-8 shadow-premium"
              >
                <span className="mb-5 inline-block rounded-full bg-yellow-400 px-4 py-2 text-xs font-black uppercase tracking-widest text-black">
                  {event.status || "Open"}
                </span>

                <h3 className="mb-4 text-2xl font-black text-gray-950">
                  {event.title}
                </h3>

                <p className="mb-6 text-gray-700">{event.description}</p>

                <div className="mb-6 space-y-2 text-gray-700">
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

                {registeringEventId === event.id ? (
                  <div className="space-y-3 rounded-2xl bg-gray-100 p-4">
                    <input
                      name="member_id"
                      value={registrationForm.member_id}
                      onChange={handleRegistrationChange}
                      placeholder="Member ID"
                      className="w-full rounded-xl border px-4 py-3 text-gray-950"
                    />

                    <input
                      name="member_name"
                      value={registrationForm.member_name}
                      onChange={handleRegistrationChange}
                      placeholder="Full Name"
                      className="w-full rounded-xl border px-4 py-3 text-gray-950"
                    />

                    <input
                      name="member_email"
                      value={registrationForm.member_email}
                      onChange={handleRegistrationChange}
                      placeholder="Email"
                      type="email"
                      className="w-full rounded-xl border px-4 py-3 text-gray-950"
                    />

                    <button
                      onClick={() => registerForEvent(event.id)}
                      className="w-full rounded-xl bg-gray-950 px-5 py-3 font-bold text-white hover:bg-gray-800"
                    >
                      Submit Registration
                    </button>

                    <button
                      onClick={() => setRegisteringEventId(null)}
                      className="w-full rounded-xl bg-gray-200 px-5 py-3 font-bold text-gray-800 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setRegisteringEventId(event.id)}
                    className="w-full rounded-xl bg-gray-950 px-5 py-3 font-bold text-white hover:bg-gray-800"
                  >
                    Register
                  </button>
                )}
              </div>
            ))}
          </div>

          {visibleEvents.length === 0 && (
            <p className="rounded-3xl bg-white p-8 text-center font-bold text-gray-700 shadow-premium">
              No upcoming events have been posted yet.
            </p>
          )}
        </div>
      </section>

      <section className="bg-gray-100 px-6 py-20">
        <div className="mx-auto rounded-3xl bg-gray-950 p-8 text-white shadow-premium md:flex md:max-w-7xl items-center justify-between gap-8 md:p-12">
          <div>
            <p className="mb-4 font-bold uppercase tracking-widest text-yellow-400">
              Host or Sponsor an Event
            </p>

            <h2 className="mb-4 text-3xl font-black md:text-5xl">
              Partner with USBC Events
            </h2>

            <p className="max-w-3xl text-gray-300">
              Businesses, partners, and community members can support USBC
              events through sponsorship, volunteering, venue support, and
              collaboration.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}