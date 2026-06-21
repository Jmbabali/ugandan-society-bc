"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminNav from "@/app/components/AdminNav";

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

type EventRegistration = {
  id: number;
  event_id: number;
  member_id: string;
  member_name: string;
  member_email: string;
  registration_date: string;
  status: string;
};

export default function AdminEventsPage() {
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [message, setMessage] = useState("");
  const [checkingLogin, setCheckingLogin] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    event_date: "",
    event_time: "",
    registration_deadline: "",
    status: "Open",
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("usbc_admin_logged_in");

    if (isLoggedIn !== "true") {
      router.push("/admin/login");
      return;
    }

    setCheckingLogin(false);
    loadEvents();
    loadRegistrations();
  }, [router]);

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

  async function loadRegistrations() {
    const { data, error } = await supabase
      .from("EventRegistrations")
      .select("*")
      .order("registration_date", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setRegistrations(data || []);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function createEvent(e: React.FormEvent) {
    e.preventDefault();

    setMessage("Creating event...");

    const { error } = await supabase.from("Events").insert({
      title: form.title,
      description: form.description,
      location: form.location,
      event_date: form.event_date,
      event_time: form.event_time,
      registration_deadline: form.registration_deadline,
      status: form.status,
      created_at: new Date().toISOString(),
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Event created successfully.");

    setForm({
      title: "",
      description: "",
      location: "",
      event_date: "",
      event_time: "",
      registration_deadline: "",
      status: "Open",
    });

    await loadEvents();
  }

  async function deleteEvent(event: Event) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );

    if (!confirmed) return;

    setMessage("Deleting event...");

    const { error } = await supabase
      .from("Events")
      .delete()
      .eq("id", event.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Event deleted successfully.");
    await loadEvents();
  }

  async function updateEventStatus(event: Event, status: string) {
    setMessage("Updating event status...");

    const { error } = await supabase
      .from("Events")
      .update({ status })
      .eq("id", event.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Event status updated.");
    await loadEvents();
  }

  function exportRegistrationsCSV() {
    const headers = [
      "Event ID",
      "Member ID",
      "Member Name",
      "Member Email",
      "Registration Date",
      "Status",
    ];

    const rows = registrations.map((registration) => [
      registration.event_id,
      registration.member_id,
      registration.member_name,
      registration.member_email,
      registration.registration_date,
      registration.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "usbc-event-registrations.csv";
    link.click();

    URL.revokeObjectURL(url);
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
    <main className="min-h-screen bg-gray-100 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
              USBC Admin
            </p>

            <h1 className="text-4xl font-black text-gray-950 md:text-6xl">
              Event Management
            </h1>

            <p className="mt-4 max-w-3xl text-lg text-gray-700">
              Create events, manage registrations, open or close registration,
              and export event attendee lists.
            </p>
          </div>

          <button
            onClick={exportRegistrationsCSV}
            className="rounded-xl bg-gray-950 px-6 py-4 font-bold text-white hover:bg-gray-800"
          >
            Export Registrations CSV
          </button>
        </div>

        {message && (
          <p className="mb-8 rounded-xl bg-yellow-100 p-4 font-bold text-gray-950">
            {message}
          </p>
        )}

        <form
          onSubmit={createEvent}
          className="mb-10 rounded-3xl border bg-white p-8 shadow-premium"
        >
          <h2 className="mb-6 text-3xl font-black text-gray-950">
            Create New Event
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Event Title"
              className="rounded-xl border px-4 py-4 text-gray-950"
            />

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="Location"
              className="rounded-xl border px-4 py-4 text-gray-950"
            />

            <input
              type="date"
              name="event_date"
              value={form.event_date}
              onChange={handleChange}
              required
              className="rounded-xl border px-4 py-4 text-gray-950"
            />

            <input
              name="event_time"
              value={form.event_time}
              onChange={handleChange}
              required
              placeholder="Event Time, e.g. 2:00 PM"
              className="rounded-xl border px-4 py-4 text-gray-950"
            />

            <input
              type="date"
              name="registration_deadline"
              value={form.registration_deadline}
              onChange={handleChange}
              required
              className="rounded-xl border px-4 py-4 text-gray-950"
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="rounded-xl border px-4 py-4 text-gray-950"
            >
              <option>Open</option>
              <option>Closed</option>
              <option>Hidden</option>
            </select>
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            placeholder="Event Description"
            className="mt-4 h-36 w-full rounded-xl border px-4 py-4 text-gray-950"
          />

          <button
            type="submit"
            className="mt-6 rounded-xl bg-gray-950 px-8 py-4 font-bold text-white hover:bg-gray-800"
          >
            Create Event
          </button>
        </form>

        <section className="mb-10">
          <h2 className="mb-6 text-3xl font-black text-gray-950">
            Current Events
          </h2>

          <div className="grid gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-3xl border bg-white p-6 shadow-premium"
              >
                <div className="grid gap-6 lg:grid-cols-4">
                  <div>
                    <p className="text-sm font-bold uppercase text-gray-500">
                      Event
                    </p>

                    <h3 className="text-2xl font-black text-gray-950">
                      {event.title}
                    </h3>

                    <p className="mt-2 text-gray-700">
                      {event.description}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold uppercase text-gray-500">
                      Details
                    </p>

                    <p className="font-bold text-gray-950">
                      {event.event_date}
                    </p>

                    <p className="text-gray-700">{event.event_time}</p>
                    <p className="text-gray-700">{event.location}</p>

                    <p className="mt-2 text-sm text-gray-600">
                      Deadline: {event.registration_deadline}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold uppercase text-gray-500">
                      Status
                    </p>

                    <p className="font-black text-gray-950">
                      {event.status}
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      Registrations:{" "}
                      {
                        registrations.filter(
                          (registration) => registration.event_id === event.id
                        ).length
                      }
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => updateEventStatus(event, "Open")}
                      className="rounded-xl bg-green-700 px-6 py-4 font-bold text-white hover:bg-green-800"
                    >
                      Open
                    </button>

                    <button
                      onClick={() => updateEventStatus(event, "Closed")}
                      className="rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black hover:bg-yellow-300"
                    >
                      Close
                    </button>

                    <button
                      onClick={() => updateEventStatus(event, "Hidden")}
                      className="rounded-xl bg-gray-700 px-6 py-4 font-bold text-white hover:bg-gray-800"
                    >
                      Hide
                    </button>

                    <button
                      onClick={() => deleteEvent(event)}
                      className="rounded-xl bg-red-700 px-6 py-4 font-bold text-white hover:bg-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {events.length === 0 && (
              <p className="rounded-3xl bg-white p-8 text-center font-bold text-gray-700">
                No events created yet.
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-3xl font-black text-gray-950">
            Event Registrations
          </h2>

          <div className="grid gap-4">
            {registrations.map((registration) => (
              <div
                key={registration.id}
                className="rounded-2xl border bg-white p-5 shadow"
              >
                <div className="grid gap-4 md:grid-cols-5">
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-500">
                      Event ID
                    </p>
                    <p className="font-bold text-gray-950">
                      {registration.event_id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-gray-500">
                      Member
                    </p>
                    <p className="font-bold text-gray-950">
                      {registration.member_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-gray-500">
                      Member ID
                    </p>
                    <p className="font-bold text-gray-950">
                      {registration.member_id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-gray-500">
                      Email
                    </p>
                    <p className="font-bold text-gray-950">
                      {registration.member_email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-gray-500">
                      Status
                    </p>
                    <p className="font-bold text-green-700">
                      {registration.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {registrations.length === 0 && (
              <p className="rounded-3xl bg-white p-8 text-center font-bold text-gray-700">
                No event registrations yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}