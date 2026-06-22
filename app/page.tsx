import Image from "next/image";
import Link from "next/link";

const partners = [
  {
    name: "Tamutamu",
    logo: "/partners/partner1.png",
    website: "https://www.tamutamu.co",
  },
  {
    name: "Bytewave Innovations Limited",
    logo: "/partners/bytewave.png",
    website: "https://bytewaveinnovations.ca",
  },
  ];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950">
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.25),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(220,38,38,0.25),transparent_25%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-32">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="mb-5 font-bold uppercase tracking-widest text-yellow-400">
                Ugandan Society in BC
              </p>

              <h1 className="mb-8 text-5xl font-black leading-tight md:text-7xl">
                A Stronger Ugandan Community in British Columbia
              </h1>

              <p className="mb-10 max-w-2xl text-xl text-gray-300">
                Connecting families, professionals, students, entrepreneurs,
                newcomers, and friends of Uganda through culture, service,
                business, and community support.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/membership"
                  className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-black transition hover:bg-yellow-300"
                >
                  Join the Community
                </Link>

                <Link
                  href="/events"
                  className="rounded-full border border-white/20 bg-white/10 px-8 py-4 font-bold transition hover:bg-white hover:text-black"
                >
                  View Events
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-yellow-400/20 blur-3xl" />

              <div className="relative rounded-[2.5rem] bg-white p-10 shadow-2xl">
                <Image
                  src="/logo.png"
                  alt="Ugandan Society in BC Logo"
                  width={360}
                  height={360}
                  priority
                  className="mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="-mt-12 relative z-10 px-6">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">
          {[
            ["Unity", "Bringing people together"],
            ["Culture", "Preserving Ugandan heritage"],
            ["Support", "Helping members and newcomers"],
            ["Growth", "Empowering families and businesses"],
          ].map(([title, text]) => (
            <div key={title} className="rounded-3xl border bg-white p-8 shadow-2xl">
              <h3 className="mb-3 text-2xl font-bold text-gray-950">{title}</h3>
              <p className="text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 bg-gray-100 px-6 py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-gray-950 p-10 text-white shadow-2xl">
            <p className="mb-4 font-bold uppercase tracking-widest text-yellow-400">
              Our Mission
            </p>

            <h2 className="mb-6 text-4xl font-black md:text-5xl">
              Connected. Supported. Empowered.
            </h2>

            <p className="text-lg leading-8 text-gray-300">
              We strive to create a welcoming and safe environment where
              community members feel connected, supported, and empowered to
              participate in their community and live meaningful and robust
              lives.
            </p>
          </div>

          <div>
            <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
              Explore USBC
            </p>

            <h2 className="mb-6 text-4xl font-black text-gray-950 md:text-5xl">
              Everything our community needs in one place.
            </h2>

            <p className="mb-8 text-lg leading-8 text-gray-700">
              From membership and events to business support, newcomer
              resources, partnerships, and donations, USBC is building a central
              platform for Ugandans and friends of Uganda in BC.
            </p>

            <Link
              href="/about"
              className="inline-block rounded-full bg-gray-950 px-8 py-4 font-bold text-white transition hover:bg-gray-800"
            >
              Learn About USBC
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24">
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
            {[
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
            ].map((item) => (
              <Link
                key={item.title}
                href={item.link}
                className="group rounded-[2rem] border bg-gray-50 p-8 shadow-premium transition hover:bg-gray-950"
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