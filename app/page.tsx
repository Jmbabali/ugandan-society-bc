import Image from "next/image";
import Link from "next/link";

const partners = [
  {
    name: "Tamutamu",
    logo: "/partners/",
    website: "https://www.tamutamu.co",
  },
  {
    name: "Bytewave Innovations Limited",
    logo: "/partners/bytewave.png",
    website: "https://bytewaveinnovations.ca",
  },
];

const highlights = [
  {
    title: "Unity",
    text: "Bringing people together",
    icon: "🤝",
  },
  {
    title: "Culture",
    text: "Preserving Ugandan heritage",
    icon: "🥁",
  },
  {
    title: "Support",
    text: "Helping members and newcomers",
    icon: "❤️",
  },
  {
    title: "Growth",
    text: "Empowering families and businesses",
    icon: "🌱",
  },
];

const platformCards = [
  {
    title: "Become a Member",
    text: "Join USBC, access member benefits, events, updates, and future digital membership services.",
    link: "/membership",
  },
  {
    title: "Attend Events",
    text: "Participate in cultural celebrations, networking sessions, workshops, sports, and community gatherings.",
    link: "/events",
  },
  {
    title: "Business Hub",
    text: "Discover and promote Ugandan-owned businesses, professionals, entrepreneurs, and partners in BC.",
    link: "/business-hub",
  },
  {
    title: "Gallery",
    text: "Explore approved photos and memories from USBC activities, gatherings, and cultural events.",
    link: "/gallery",
  },
  {
    title: "Resources",
    text: "Access newcomer support, employment guidance, youth resources, and community referrals.",
    link: "/resources",
  },
  {
    title: "Support USBC",
    text: "Donate, sponsor programs, support events, or partner with USBC to strengthen community impact.",
    link: "/donations",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950">
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0">
          <Image
            src="/home/community-1.png"
            alt="Ugandan community in British Columbia"
            fill
            priority
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 to-gray-950/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.30),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(220,38,38,0.25),transparent_25%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="mb-5 font-bold uppercase tracking-widest text-yellow-400">
                Ugandan Society in BC
              </p>

              <h1 className="mb-8 text-5xl font-black leading-tight md:text-7xl">
                A Stronger Ugandan Community in British Columbia
              </h1>

              <p className="mb-10 max-w-2xl text-xl text-gray-200">
                Connecting families, professionals, students, entrepreneurs,
                newcomers, and friends of Uganda through culture, service,
                business, and community support.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/membership"
                  className="rounded-full bg-yellow-400 px-8 py-4 font-black text-black shadow-xl transition hover:-translate-y-1 hover:bg-yellow-300"
                >
                  Join the Community
                </Link>

                <Link
                  href="/donations"
                  className="rounded-full bg-red-600 px-8 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-red-700"
                >
                  Donate
                </Link>

                <Link
                  href="/events"
                  className="rounded-full border border-white/30 bg-white/10 px-8 py-4 font-bold backdrop-blur transition hover:bg-white hover:text-black"
                >
                  View Events
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[3rem] bg-yellow-400/20 blur-3xl" />

              <div className="relative grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative h-64 overflow-hidden rounded-[2rem] shadow-2xl">
                    <Image
                      src="/home/community-2.png"
                      alt="USBC community gathering"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="relative h-64 overflow-hidden rounded-[2rem] shadow-2xl">
                    <Image
                      src="/home/community-3.png"
                      alt="Ugandan cultural celebration"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="relative h-56 overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
                  <Image
                    src="/home/community-4.png"
                    alt="Community support and connection"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-950/70 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <Image
                      src="/logo.png"
                      alt="USBC Logo"
                      width={70}
                      height={70}
                      className="mb-3 rounded-full bg-white p-2"
                    />
                    <p className="text-2xl font-black">
                      Building Connections.
                    </p>
                    <p className="text-yellow-400 font-bold">
                      Preserving Heritage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-16 grid gap-4 rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur md:grid-cols-4">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-black/20 p-6"
              >
                <div className="mb-3 text-3xl">{item.icon}</div>
                <h3 className="mb-2 text-xl font-black text-yellow-400">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
              Who We Are
            </p>

            <h2 className="mb-6 text-4xl font-black text-gray-950 md:text-5xl">
              Building Connections. Preserving Heritage. Empowering Community.
            </h2>

            <p className="mb-8 text-lg leading-8 text-gray-700">
              USBC is a community platform for Ugandans and friends of Uganda in
              British Columbia. We promote unity, culture, service, networking,
              business support, and meaningful community participation.
            </p>

            <Link
              href="/about"
              className="inline-block rounded-full bg-gray-950 px-8 py-4 font-bold text-white transition hover:bg-gray-800"
            >
              Learn About USBC
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="relative h-72 overflow-hidden rounded-[2rem] shadow-xl md:mt-12">
              <Image
                src="/home/community-2.png"
                alt="Community event"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative h-72 overflow-hidden rounded-[2rem] shadow-xl">
              <Image
                src="/home/community-3.png"
                alt="Cultural event"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="h-px w-20 bg-gray-300" />
              <p className="font-serif text-2xl uppercase tracking-widest text-gray-900">
                Our Valued Sponsors & Partners
              </p>
              <div className="h-px w-20 bg-gray-300" />
            </div>

            <p className="text-gray-600">
              USBC recognizes the organizations, businesses, and community
              partners that support our programs, events, and community growth.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-10 md:grid-cols-4">
            {partners.map((partner) => (
              <a
                key={partner.name}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-32 items-center justify-center rounded-2xl bg-white p-6 shadow-sm transition hover:scale-105 hover:shadow-lg"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-24 max-w-full object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
              Community Platform
            </p>

            <h2 className="mb-6 text-4xl font-black text-gray-950 md:text-5xl">
              Get Involved Your Way
            </h2>

            <p className="text-lg text-gray-600">
              Choose how you want to connect with USBC.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {platformCards.map((item) => (
              <Link
                key={item.title}
                href={item.link}
                className="group rounded-[2rem] border bg-gray-50 p-8 shadow-premium transition hover:-translate-y-1 hover:bg-gray-950"
              >
                <h3 className="mb-4 text-2xl font-bold text-gray-950 group-hover:text-yellow-400">
                  {item.title}
                </h3>

                <p className="mb-6 text-gray-600 group-hover:text-gray-300">
                  {item.text}
                </p>

                <span className="font-bold text-red-600 group-hover:text-yellow-400">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-950 px-6 py-28 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 font-bold uppercase tracking-widest text-yellow-400">
              Business & Partnerships
            </p>

            <h2 className="mb-6 text-4xl font-black md:text-5xl">
              Supporting Ugandan businesses and community partnerships.
            </h2>

            <p className="mb-8 text-lg leading-8 text-gray-300">
              The Business Hub and Partners section help connect members with
              businesses, sponsors, professionals, community organizations, and
              opportunities across British Columbia.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/business-hub"
                className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-black transition hover:bg-yellow-300"
              >
                Business Hub
              </Link>

              <Link
                href="/contact"
                className="rounded-full border border-white/30 px-8 py-4 font-bold transition hover:bg-white hover:text-black"
              >
                Become a Sponsor
              </Link>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-8">
              <h3 className="mb-3 text-2xl font-bold text-yellow-400">
                Business Directory
              </h3>
              <p className="text-gray-300">
                Promote Ugandan-owned businesses and professional services.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-8">
              <h3 className="mb-3 text-2xl font-bold text-yellow-400">
                Sponsors & Partners
              </h3>
              <p className="text-gray-300">
                Build relationships with businesses, sponsors, and supporters.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-8">
              <h3 className="mb-3 text-2xl font-bold text-yellow-400">
                Community Growth
              </h3>
              <p className="text-gray-300">
                Support initiatives that strengthen families, youth, and
                newcomers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 px-6 py-28">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-white p-12 text-center shadow-2xl">
          <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
            Join USBC
          </p>

          <h2 className="mb-6 text-4xl font-black text-gray-950 md:text-6xl">
            Be part of something bigger.
          </h2>

          <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-600">
            Join a growing community dedicated to unity, culture, service,
            business support, and meaningful connection.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/membership"
              className="rounded-full bg-gray-950 px-8 py-4 font-bold text-white transition hover:bg-gray-800"
            >
              Become a Member
            </Link>

            <Link
              href="/donations"
              className="rounded-full bg-red-600 px-8 py-4 font-bold text-white transition hover:bg-red-700"
            >
              Donate
            </Link>

            <Link
              href="/contact"
              className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-black transition hover:bg-yellow-300"
            >
              Contact USBC
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}