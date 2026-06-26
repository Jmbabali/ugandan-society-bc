import Link from "next/link";

const partners = [
  { name: "Tamutamu", logo: "/partners/tamutamu.jpeg", website: "https://www.tamutamu.co",},
  { name: "Bytewave Innovations Limited", logo: "/partners/bytewave.png", website: "https://bytewaveinnovations.ca",},
];

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-4 font-bold uppercase tracking-widest text-yellow-400">
            Partners & Sponsors
          </p>

          <h1 className="mb-6 text-4xl font-black md:text-6xl">
            Our Valued Sponsors & Partners
          </h1>

          <p className="mx-auto max-w-3xl text-lg text-gray-300">
            USBC appreciates the organizations, businesses, and community
            supporters who help strengthen our programs, events, and community
            initiatives.
          </p>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-gray-300" />

            <h2 className="font-serif text-2xl uppercase tracking-widest text-gray-900 md:text-3xl">
              Our Valued Sponsors & Partners
            </h2>

            <div className="h-px w-20 bg-gray-300" />
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

      <section className="bg-gray-100 px-6 py-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gray-950 p-10 text-center text-white shadow-2xl">
          <p className="mb-4 font-bold uppercase tracking-widest text-yellow-400">
            Become a Sponsor
          </p>

          <h2 className="mb-4 text-3xl font-black md:text-5xl">
            Support USBC Community Programs
          </h2>

          <p className="mx-auto mb-8 max-w-3xl text-gray-300">
            To support USBC events, cultural programs, newcomer support,
            business networking, and community initiatives, contact us directly.
          </p>

          <Link
            href="/contact"
            className="inline-block rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black transition hover:bg-yellow-300"
          >
            Contact USBC
          </Link>
        </div>
      </section>
    </main>
  );
}