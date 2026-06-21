import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950">
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.25),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(220,38,38,0.25),transparent_25%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-32">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-yellow-400 uppercase tracking-widest font-bold mb-5">
                Ugandan Society in BC
              </p>

              <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
                A Stronger Ugandan Community in British Columbia
              </h1>

              <p className="text-xl text-gray-300 max-w-2xl mb-10">
                Connecting families, professionals, students, entrepreneurs,
                newcomers, and friends of Uganda through culture, service,
                business, and community support.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/membership"
                  className="bg-yellow-400 text-black px-8 py-4 rounded-full font-bold hover:bg-yellow-300 transition"
                >
                  Join the Community
                </Link>

                <Link
                  href="/events"
                  className="bg-white/10 border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white hover:text-black transition"
                >
                  View Events
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-yellow-400/20 blur-3xl" />

              <div className="relative bg-white rounded-[2.5rem] p-10 shadow-2xl">
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
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-5">
          {[
            ["Unity", "Bringing people together"],
            ["Culture", "Preserving Ugandan heritage"],
            ["Support", "Helping members and newcomers"],
            ["Growth", "Empowering families and businesses"],
          ].map(([title, text]) => (
            <div
              key={title}
              className="bg-white rounded-3xl p-8 shadow-2xl border"
            >
              <h3 className="text-2xl font-bold text-gray-950 mb-3">
                {title}
              </h3>
              <p className="text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-28 px-6 bg-gray-100 mt-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-950 text-white rounded-[2rem] p-10 shadow-2xl">
            <p className="text-yellow-400 uppercase tracking-widest font-bold mb-4">
              Our Mission
            </p>

            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Connected. Supported. Empowered.
            </h2>

            <p className="text-gray-300 text-lg leading-8">
              We strive to create a welcoming and safe environment where
              community members feel connected, supported, and empowered to
              participate in their community and live meaningful and robust
              lives.
            </p>
          </div>

          <div>
            <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
              Explore USBC
            </p>

            <h2 className="text-4xl md:text-5xl font-black text-gray-950 mb-6">
              Everything our community needs in one place.
            </h2>

            <p className="text-lg text-gray-700 leading-8 mb-8">
              From membership and events to business support, newcomer
              resources, partnerships, and donations, USBC is building a central
              platform for Ugandans and friends of Uganda in BC.
            </p>

            <Link
              href="/about"
              className="inline-block bg-gray-950 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition"
            >
              Learn About USBC
            </Link>
          </div>
        </div>
      </section>

      <section className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
              Community Platform
            </p>

            <h2 className="text-4xl md:text-5xl font-black text-gray-950 mb-6">
              Get Involved Your Way
            </h2>

            <p className="text-lg text-gray-600">
              Choose how you want to connect with USBC.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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
                className="group bg-gray-50 rounded-[2rem] p-8 border shadow-premium hover:bg-gray-950 transition"
              >
                <h3 className="text-2xl font-bold text-gray-950 group-hover:text-yellow-400 mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-600 group-hover:text-gray-300 mb-6">
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

      <section className="py-28 px-6 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-yellow-400 uppercase tracking-widest font-bold mb-4">
              Business & Partnerships
            </p>

            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Supporting Ugandan businesses and community partnerships.
            </h2>

            <p className="text-lg text-gray-300 leading-8 mb-8">
              The Business Hub and Partners section help connect members with
              businesses, sponsors, professionals, community organizations, and
              opportunities across British Columbia.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/business-hub"
                className="bg-yellow-400 text-black px-8 py-4 rounded-full font-bold hover:bg-yellow-300 transition"
              >
                Business Hub
              </Link>

              <Link
                href="/partners"
                className="border border-white/30 px-8 py-4 rounded-full font-bold hover:bg-white hover:text-black transition"
              >
                Partners
              </Link>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="bg-white/10 border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-3">
                Business Directory
              </h3>
              <p className="text-gray-300">
                Promote Ugandan-owned businesses and professional services.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-3">
                Sponsors & Partners
              </h3>
              <p className="text-gray-300">
                Build relationships with businesses, sponsors, and supporters.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-3">
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

      <section className="py-28 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center bg-white rounded-[2.5rem] p-12 shadow-2xl">
          <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
            Join USBC
          </p>

          <h2 className="text-4xl md:text-6xl font-black text-gray-950 mb-6">
            Be part of something bigger.
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Join a growing community dedicated to unity, culture, service,
            business support, and meaningful connection.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/membership"
              className="bg-gray-950 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition"
            >
              Become a Member
            </Link>

            <Link
              href="/contact"
              className="bg-yellow-400 text-black px-8 py-4 rounded-full font-bold hover:bg-yellow-300 transition"
            >
              Contact USBC
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}