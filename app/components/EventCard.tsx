import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3, MapPin } from "lucide-react";

export type EventSummary = {
  id: number;
  title: string;
  location: string;
  event_date: string;
  event_time: string;
  poster_url: string | null;
};

type EventCardProps = {
  event: EventSummary;
};

function formatEventDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return value;

  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export default function EventCard({ event }: EventCardProps) {
  const eventHref = `/events/${event.id}`;

  return (
    <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <h3 className="sr-only">{event.title}</h3>

      <Link
        href={eventHref}
        aria-label={`View details for ${event.title}`}
        className="group relative block aspect-[4/5] overflow-hidden bg-gray-100"
      >
        {event.poster_url ? (
          <Image
            src={event.poster_url}
            alt={`${event.title} event poster`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <span className="flex h-full items-center justify-center px-6 text-center font-bold text-gray-500">
            Event poster coming soon
          </span>
        )}
      </Link>

      <div className="space-y-4 p-6 text-gray-700">
        <p className="flex items-start gap-3">
          <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <span>{formatEventDate(event.event_date)}</span>
        </p>

        <p className="flex items-start gap-3">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <span>{event.event_time}</span>
        </p>

        <p className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <span>{event.location}</span>
        </p>

        <Link
          href={eventHref}
          className="block rounded-xl bg-gray-950 px-6 py-4 text-center font-bold text-white transition hover:bg-gray-800"
        >
          View Event →
        </Link>
      </div>
    </article>
  );
}
