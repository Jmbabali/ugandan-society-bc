"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  created_at?: string;
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
  const [posterFile, setPosterFile] = useState<File | null>(null);

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

  async function refreshAll() {
    await loadEvents();
    await loadRegistrations();
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function createEvent(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Creating event...");

    let posterUrl = "";

    if (posterFile) {
      const fileExt = posterFile.name.split(".").pop() || "jpg";
      const safeFileName = `event-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("event-posters")
        .upload(safeFileName, posterFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setMessage(uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("event-posters")
        .getPublicUrl(safeFileName);

      posterUrl = data.publicUrl;
    }

    const { error } = await supabase.from("Events").insert({
      title: form.title,
      description: form.description,
      location: form.location,
      event_date: form.event_date,
      event_time: form.event_time,
      registration_deadline: form.registration_deadline,
      status: form.status,
      poster_url: posterUrl,
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

    setPosterFile(null);
    await refreshAll();
  }

  async function deleteEvent(event: Event) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );

    if (!confirmed) return;

    setMessage("Deleting event...");

    const { error } = await supabase.from("Events").delete().eq("id", event.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Event deleted successfully.");
    await refreshAll();
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
    await refreshAll();
  }

  function getRegistrationCount(eventId: number) {
    return registrations.filter((registration) => registration.event_id === eventId)
      .length;
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

  const openEvents = events.filter((event) => event.status === "Open").length;
  const closedEvents = events.filter((event) => event.status === "Closed").length;
  const hiddenEvents = events.filter((event) => event.status === "Hidden").length;

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
              Create events, upload posters, manage visibility, track
              registrations, and export attendee lists.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={refreshAll}
              className="rounded-xl bg-white px-6 py-4 font-bold text-gray-950 shadow hover:bg-gray-50"
            >
              Refresh
            </button>

            <button
              onClick={exportRegistrationsCSV}
              className="rounded-xl bg-gray-950 px-6 py-4 font-bold text-white hover:bg-gray-800"
            >
              Export CSV
            </button>
          </div>
        </div>

        {message && (
          <p className="mb-8 rounded-xl bg-yellow-100 p-4 font-bold text-gray-950">
            {message}
          </p>
        )}

        <div className="mb-10 grid gap-4 md:grid-cols-5">
          <div className="rounded-3xl bg-gray-950 p-6 text-white shadow">
            <p className="text-sm font-bold uppercase text-gray-300">
              Total Events
            </p>
            <p className="mt-2 text-4xl font-black">{events.length}</p>
          </div>

          <div className="rounded-3xl bg-green-50 p-6 shadow">
            <p className="text-sm font-bold uppercase text-gray-500">Open</p>
            <p className="mt-2 text-4xl font-black text-green-700">
              {openEvents}
            </p>
          </div>

          <div className="rounded-3xl bg-yellow-50 p-6 shadow">
            <p className="text-sm font-bold uppercase text-gray-500">Closed</p>
            <p className="mt-2 text-4xl font-black text-yellow-700">
              {closedEvents}
            </p>
          </div>

          <div className="rounded-3xl bg-gray-200 p-6 shadow">
            <p className="text-sm font-bold uppercase text-gray-500">Hidden</p>
            <p className="mt-2 text-4xl font-black text-gray-950">
              {hiddenEvents}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm font-bold uppercase text-gray-500">
              Registrations
            </p>
            <p className="mt-2 text-4xl font-black">
              {registrations.length}
            </p>
          </div>
        </div>

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

          <div className="mt-4">
            <label className="mb-2 block text-sm font-bold uppercase text-gray-500">
              Event Poster / Flyer
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
              className="w-full rounded-xl border bg-white px-4 py-4 text-gray-950"
            />

            <p className="mt-2 text-sm text-gray-600">
              Optional. Upload a poster or flyer image for this event.
            </p>
          </div>

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
                <div className="grid gap-6 lg:grid-cols-5">
                  <div>
                    {event.poster_url ? (
                      <img
                        src={event.poster_url}
                        alt={event.title}
                        className="h-44 w-full rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-44 w-full items-center justify-center rounded-2xl bg-gray-100 font-bold text-gray-500">
                        No Poster
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-2">
                    <p className="text-sm font-bold uppercase text-gray-500">
                      Event
                    </p>

                    <h3 className="text-2xl font-black text-gray-950">
                      {event.title}
                    </h3>

                    <p className="mt-2 text-gray-700">{event.description}</p>
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

                    <p className="mt-3 text-sm font-bold text-gray-950">
                      Status: {event.status}
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      Registrations: {getRegistrationCount(event.id)}
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
      </div>
    </main>
  );
}