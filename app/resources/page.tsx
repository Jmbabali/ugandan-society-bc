import Link from "next/link";

export default function ResourcesPage() {
  const resources = [
    {
      title: "Newcomer Support",
      description:
        "Helpful information for Ugandans and families settling in British Columbia, including settlement services, housing, employment, and community connections.",
    },
    {
      title: "Employment & Careers",
      description:
        "Resources for job search, resume preparation, networking, professional development, and career growth in Canada.",
    },
    {
      title: "Education & Youth",
      description:
        "Information for students, parents, and youth, including school support, scholarships, mentorship, and leadership opportunities.",
    },
    {
      title: "Health & Wellness",
      description:
        "Community wellness information, health access guidance, mental wellness resources, and support services.",
    },
    {
      title: "Immigration Information",
      description:
        "General information sessions and links to trusted public resources related to immigration, settlement, and citizenship pathways.",
    },
    {
      title: "Community Assistance",
      description:
        "Support pathways for members facing hardship, emergency situations, or needing referrals to community services.",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gray-950 px-6 py-20 text-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-yellow-400 uppercase tracking-widest font-bold mb-4">
            Resources
          </p>

          <h1 className="text-4xl md:text-6xl font-black mb-6 max-w-5xl">
            Community Resources for Support, Growth, and Connection
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
            USBC provides helpful information, referrals, and community
            resources that support newcomers, families, students, professionals,
            and members across British Columbia.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
              Resource Categories
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-4">
              Helpful Support Areas
            </h2>

            <p className="text-lg text-gray-700">
              These resources are designed to help community members find
              information, support, and trusted referrals when needed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div
                key={resource.title}
                className="rounded-3xl bg-white p-8 shadow-premium border card-hover"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 font-black text-black">
                  ✓
                </div>

                <h3 className="text-2xl font-black text-gray-950 mb-4">
                  {resource.title}
                </h3>

                <p className="text-gray-700">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          <div className="rounded-3xl bg-gray-50 p-8 md:p-10 shadow-premium border">
            <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
              Need Support?
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-6">
              Request Community Guidance
            </h2>

            <p className="text-gray-700 mb-6">
              Members and newcomers may contact USBC for general guidance,
              referrals, and information about available community resources.
            </p>

            <Link
              href="/contact"
              className="inline-block rounded-xl bg-gray-950 px-6 py-4 font-bold text-white hover:bg-gray-800 transition"
            >
              Contact USBC
            </Link>
          </div>

          <div className="rounded-3xl bg-gray-950 p-8 md:p-10 text-white shadow-premium border border-gray-800">
            <p className="text-yellow-400 uppercase tracking-widest font-bold mb-4">
              Disclaimer
            </p>

            <h2 className="text-3xl font-black mb-6">
              Information & Referrals
            </h2>

            <p className="text-gray-300">
              USBC may provide general information and community referrals. This
              information does not replace professional legal, medical,
              immigration, financial, or counselling advice.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}