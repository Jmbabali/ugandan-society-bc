"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, Music, HeartHandshake, TrendingUp } from "lucide-react";
import Stats from "./components/Stats";
import WhyJoin from "./components/WhyJoin";
import LatestUpdates from "./components/LatestUpdates";

const heroSlides = [
  {image: "/home/image1.jpg",},
  {image: "/home/image2.jpg",},
  {image: "/home/image3.jpg",},
  {image: "/home/image4.jpg",},
  {image: "/home/image5.jpeg",}, 
  {image: "/home/image6.jpg",},
];

const actionSlides = [
  {
    main: "/home/team.jpg",
    sideTop: "/home/dance.jpg",
    sideBottom: "/home/registration.jpg",
  },
  {
    main: "/home/bbq2.jpg",
    sideTop: "/home/abbots.jpg",
    sideBottom: "/home/event.jpg",
  },
  {
    main: "/home/bbq.jpg",
    sideTop: "/home/vibes.jpg",
    sideBottom: "/home/bbq3.jpg",
  },
];

const highlights = [
  {
    title: "Unity",
    text: "Bringing people together across generations.",
    icon: Users,
  },
  {
    title: "Culture",
    text: "Preserving Ugandan heritage and traditions.",
    icon: Music,
  },
  {
    title: "Support",
    text: "Helping members and newcomers thrive.",
    icon: HeartHandshake,
  },
  {
    title: "Growth",
    text: "Empowering families and businesses.",
    icon: TrendingUp,
  },
];

const partners = [
  {
    name: "Tamutamu",
    logo: "/partners/tamutamu.jpeg",
    website: "https://www.tamutamu.co",
  },
  {
    name: "Bytewave Innovations Limited",
    logo: "/partners/bytewave.png",
    website: "https://bytewaveinnovations.ca",
  },
    {
    name: "Uganda BC Cranes Soccer Association",
    logo: "/partners/bccranes.webp",
    website: "https://ugandabccranes.ca/",
  },
];

const connectCards = [
  {
    title: "Become a Member",
    text: "Access member benefits, updates, events, and digital services.",
    link: "/membership",
    image: "/home/become-member.jpg",
  },
  {
    title: "Attend Events",
    text: "Join cultural events, workshops, sports, and gatherings.",
    link: "/events",
    image: "/home/events.jpg",
  },
  {
    title: "Business Hub",
    text: "Promote Ugandan businesses and professional services in BC.",
    link: "/business-hub",
    image: "/home/business-hub.jpg",
  },
  {
    title: "Gallery",
    text: "Explore photos and memories from our events and activities.",
    link: "/gallery",
    image: "/home/gallery.jpg",
  },
  {
    title: "Resources",
    text: "Find newcomer support, jobs, youth resources, and referrals.",
    link: "/resources",
    image: "/home/resources.jpg",
  },
  {
    title: "Support USBC",
    text: "Donate, sponsor programs, or partner with us.",
    link: "/donations",
    image: "/home/support1.jpg",
  },
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeAction, setActiveAction] = useState(0);

  const slide = heroSlides[activeSlide];
  const action = actionSlides[activeAction];
  useEffect(() => {
  const heroTimer = setInterval(() => {
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  }, 5000);

  const actionTimer = setInterval(() => {
    setActiveAction((current) => (current + 1) % actionSlides.length);
  }, 5000);

  return () => {
    clearInterval(heroTimer);
    clearInterval(actionTimer);
  };
}, []);

  return (
    <main className="min-h-screen bg-white">
    <section className="relative overflow-hidden bg-white">
  <div className="relative h-[88vh] min-h-[700px] w-full overflow-hidden bg-black">
    {heroSlides.map((item, index) => (
      <Image
        key={item.image}
        src={item.image}
        alt={item.title}
        fill
        priority={index === 0}
        sizes="100vw"
        className={`object-cover transition-opacity duration-1000 ${
          activeSlide === index ? "opacity-100" : "opacity-0"
        }`}
      />
    ))}

    <button
      onClick={() =>
        setActiveSlide(
          activeSlide === 0 ? heroSlides.length - 1 : activeSlide - 1
        )
      }
      className="absolute left-8 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-4xl font-black text-white hover:bg-white hover:text-black"
    >
      ‹
    </button>

    <button
      onClick={() => setActiveSlide((activeSlide + 1) % heroSlides.length)}
      className="absolute right-6 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-4xl font-black text-white hover:bg-white hover:text-black"
    >
      ›
    </button>

    <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-4">
      {heroSlides.map((_, index) => (
        <button
          key={index}
          onClick={() => setActiveSlide(index)}
          className={`h-5 w-5 rounded-full border-2 border-white transition-all ${
            activeSlide === index ? "bg-yellow-400" : "bg-transparent"
          }`}
        />
      ))}
    </div>
  </div>

  <div className="bg-white px-6 py-8 shadow-lg">
    <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-6">
      <Link
        href="/membership"
        className="rounded-xl bg-yellow-400 px-10 py-4 font-black text-black shadow-lg hover:bg-yellow-300"
      >
        Become a Member
      </Link>

      <Link
        href="/donations"
        className="rounded-xl bg-red-600 px-10 py-4 font-black text-white shadow-lg hover:bg-red-700"
      >
        Donate
      </Link>

      <Link
        href="/events"
        className="rounded-xl bg-gray-950 px-10 py-4 font-black text-white shadow-lg hover:bg-gray-800"
      >
        View Events
      </Link>
    </div>
  </div>
</section>

      <section className="relative z-10 -mt-4 px-6">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="border-b border-gray-200 p-8 text-center md:border-b-0 md:border-r last:border-r-0"
              >
                <Icon className="mx-auto mb-4 h-14 w-14 text-red-600" />

                <h3 className="mb-3 text-2xl font-black text-gray-950">
                  {item.title}
                </h3>

                <p className="text-gray-700">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <Stats />

      <WhyJoin/>

      <LatestUpdates/>

      <section className="bg-slate-100 px-6 py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-3">
          <div>
            <p className="mb-4 font-black uppercase tracking-widest text-red-600">
              Community in Action
            </p>

            <h2 className="mb-6 text-4xl font-black text-gray-950 md:text-5xl">
              Our Community, Our Strength
            </h2>

            <p className="mb-8 text-lg leading-8 text-gray-700">
              From cultural celebrations to community outreach, sports,
              networking, and family events, USBC is built on connection,
              participation, and shared purpose.
            </p>

            <Link
              href="/events"
              className="inline-block rounded-xl bg-red-600 px-8 py-4 font-black text-white transition hover:bg-red-700"
            >
              Explore Our Events
            </Link>
          </div>

          <div className="relative lg:col-span-2">
            <div className="grid gap-5 md:grid-cols-3">
              <div className="relative h-80 overflow-hidden rounded-3xl shadow-xl md:col-span-2">
                <Image
                  src={action.main}
                  alt="USBC community slideshow"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className="grid gap-5">
                <div className="relative h-[150px] overflow-hidden rounded-3xl shadow-xl">
                  <Image
                    src={action.sideTop}
                    alt="USBC event photo"
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>

                <div className="relative h-[150px] overflow-hidden rounded-3xl shadow-xl">
                  <Image
                    src={action.sideBottom}
                    alt="USBC community photo"
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                setActiveAction(
                  activeAction === 0
                    ? actionSlides.length - 1
                    : activeAction - 1
                )
              }
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white font-black text-gray-950 shadow-xl hover:bg-yellow-400"
            >
              ‹
            </button>

            <button
              onClick={() =>
                setActiveAction((activeAction + 1) % actionSlides.length)
              }
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white font-black text-gray-950 shadow-xl hover:bg-yellow-400"
            >
              ›
            </button>

            <div className="mt-6 flex justify-center gap-2">
              {actionSlides.map((item, index) => (
                <button
                  key={item.main}
                  onClick={() => setActiveAction(index)}
                  className={`h-3 rounded-full transition-all ${
                    activeAction === index
                      ? "w-8 bg-red-600"
                      : "w-3 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-6 pb-16">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 font-black uppercase tracking-widest text-red-600">
            Our Partners
          </p>

          <h2 className="mb-10 text-4xl font-black text-gray-950">
            Sponsors & Partners
          </h2>

          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-10 md:grid-cols-4">
            {partners.map((partner) => (
              <a
                key={partner.name}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-40 items-center justify-center rounded-3xl border bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-24 max-w-full object-contain"
                />
              </a>
            ))}
          </div>

          <Link
            href="/partners"
            className="mt-8 inline-block font-black text-red-600 hover:text-red-700"
          >
            View All Partners →
          </Link>
        </div>
      </section>

      <section className="bg-gray-100 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-4 font-black uppercase tracking-widest text-red-600">
              Get Involved
            </p>

            <h2 className="text-4xl font-black text-gray-950 md:text-5xl">
              Ways to Connect with USBC
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {connectCards.map((item) => (
              <Link
                key={item.title}
                href={item.link}
                className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-44">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <h3 className="mb-3 text-xl font-black text-gray-950">
                    {item.title}
                  </h3>

                  <p className="mb-5 text-gray-700">{item.text}</p>

                  <span className="font-black text-red-600">
                    Learn More →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-6 py-16">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gray-950 px-10 py-24 text-white shadow-2xl md:px-14">
          <Image
            src="/home/vancouver-banner.jpg"
            alt="British Columbia skyline"
            fill
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />

          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="mb-4 font-black uppercase tracking-widest text-yellow-400">
                Join USBC Today
              </p>

              <h2 className="mb-5 text-5xl font-black leading-tight md:text-5xl">
                Be part of something bigger.
              </h2>

              <p className="max-w-xl text-lg leading-8 text-gray-200">
                Join a growing community dedicated to unity, culture, service,
                business support, and meaningful connection.
              </p>
            </div>

            <div className="flex flex-row items-center justify-end gap-4 md:whitespace-nowrap">
              <Link
                href="/membership"
                className="rounded-xl bg-yellow-400 px-6 py-4 font-black text-black transition hover:bg-yellow-300"
              >
                Become a Member
              </Link>

              <Link
                href="/donations"
                className="rounded-xl bg-red-600 px-8 py-4 font-black text-white transition hover:bg-red-700"
              >
                Donate
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-white/50 px-8 py-4 font-black text-white transition hover:bg-white hover:text-black"
              >
                Contact USBC
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}