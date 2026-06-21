import Link from "next/link";

export default function PartnersPage() {
  const partnerTypes = [
    {
      title: "Community Partners",
      text: "Organizations and groups that collaborate with USBC to support community programs, outreach, newcomer support, and cultural engagement.",
    },
    {
      title: "Corporate Sponsors",
      text: "Businesses and companies that support USBC events, programs, and initiatives through sponsorship, funding, or in-kind contributions.",
    },
    {
      title: "Strategic Partners",
      text: "Institutions, agencies, and organizations that work with USBC on long-term community development, advocacy, education, and service delivery.",
    },
  ];

  const sponsorBenefits = [
    "Recognition on the USBC website",
    "Visibility at community events",
    "Promotion through selected USBC communication channels",
    "Opportunity to support cultural and community programs",
    "Networking with members, businesses, and community leaders",
    "Support for newcomer, youth, and family initiatives",
  ];

  const recognitionLevels = [
    { level: "Community Supporter", amount: "In-kind or entry-level support" },
    { level: "Bronze Sponsor", amount: "$250+" },
    { level: "Silver Sponsor", amount: "$500+" },
    { level: "Gold Sponsor", amount: "$1,000+" },
    { level: "Platinum Sponsor", amount: "$2,500+" },
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gray-950 px-6 py-20 text-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-yellow-400 uppercase tracking-widest font-bold mb-4">
            Partners & Sponsors
          </p>

          <h1 className="text-4xl md:text-6xl font-black mb-6 max-w-5xl">
            Building Stronger Communities Through Partnership
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
            USBC welcomes partnerships with businesses, community
            organizations, institutions, and supporters who share our commitment
            to cultural preservation, newcomer support, youth engagement, and
            community development.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
              Partnership Opportunities
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-4">
              Ways to Partner with USBC
            </h2>

            <p className="text-lg text-gray-700">
              Partners and sponsors help USBC deliver meaningful programs,
              events, resources, and services to the Ugandan community in
              British Columbia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {partnerTypes.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl bg-white p-8 shadow-premium border card-hover"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 font-black text-black">
                  ✓
                </div>

                <h3 className="text-2xl font-black text-gray-950 mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          <div className="rounded-3xl bg-gray-50 p-8 md:p-10 shadow-premium border">
            <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
              Sponsor Benefits
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-6">
              Why Support USBC?
            </h2>

            <p className="text-lg text-gray-700 mb-8">
              Sponsorship provides visibility while helping strengthen programs
              that support families, newcomers, youth, professionals, and the
              broader Ugandan community.
            </p>

            <div className="grid gap-4">
              {sponsorBenefits.map((benefit) => (
                <div key={benefit} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400 font-black text-black">
                    ✓
                  </span>

                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-gray-950 p-8 md:p-10 text-white shadow-premium border border-gray-800">
            <p className="text-yellow-400 uppercase tracking-widest font-bold mb-4">
              Recognition Levels
            </p>

            <h2 className="text-3xl font-black mb-6">
              Sponsorship Tiers
            </h2>

            <div className="grid gap-4">
              {recognitionLevels.map((item) => (
                <div
                  key={item.level}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/10 p-5"
                >
                  <span className="font-black text-white">{item.level}</span>
                  <span className="font-bold text-yellow-400 text-right">
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gray-950 p-8 md:p-12 text-white shadow-premium md:flex items-center justify-between gap-8">
          <div>
            <p className="text-yellow-400 uppercase tracking-widest font-bold mb-4">
              Become a Partner
            </p>

            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Support Community Impact
            </h2>

            <p className="text-gray-300 max-w-3xl">
              Partner with USBC to support cultural events, newcomer programs,
              youth initiatives, community outreach, and professional networking
              opportunities.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-block mt-8 md:mt-0 rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black hover:bg-yellow-300 transition"
          >
            Submit Partnership Interest
          </Link>
        </div>
      </section>
    </main>
  );
}