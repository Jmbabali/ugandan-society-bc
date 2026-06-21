import Link from "next/link";

export default function DonationsPage() {
  const impactAreas = [
    {
      title: "Newcomer Support",
      description:
        "Supporting newly arrived Ugandans and families as they settle and integrate into life in British Columbia.",
    },
    {
      title: "Youth Programs",
      description:
        "Providing opportunities for youth engagement, leadership development, mentorship, and cultural participation.",
    },
    {
      title: "Community Events",
      description:
        "Supporting cultural celebrations, networking events, sports activities, and community gatherings.",
    },
    {
      title: "Emergency Assistance",
      description:
        "Helping members and families facing unforeseen hardships through community support initiatives.",
    },
  ];

  const donationLevels = [
    { amount: "$25", title: "Community Supporter" },
    { amount: "$50", title: "Friend of USBC" },
    { amount: "$100", title: "Community Champion" },
    { amount: "$250", title: "Leadership Supporter" },
    { amount: "$500+", title: "Legacy Contributor" },
  ];

  const waysToGive = [
    "One-Time Donations",
    "Monthly Giving",
    "Event Sponsorship",
    "Community Program Support",
    "In-Kind Contributions",
    "Corporate Giving",
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gray-950 px-6 py-20 text-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-yellow-400 uppercase tracking-widest font-bold mb-4">
            Donations
          </p>

          <h1 className="text-4xl md:text-6xl font-black mb-6 max-w-5xl">
            Support the Growth of the Ugandan Society in BC
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
            Your generosity helps strengthen our community, support newcomers,
            empower youth, celebrate culture, and create opportunities for
            future generations.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
              Why Donate
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-4">
              Creating Lasting Community Impact
            </h2>

            <p className="text-lg text-gray-700">
              Every contribution helps USBC continue delivering programs,
              services, events, and initiatives that strengthen our community
              and support members across British Columbia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactAreas.map((area) => (
              <div
                key={area.title}
                className="rounded-3xl bg-white p-8 shadow-premium border card-hover"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 font-black text-black">
                  ♥
                </div>

                <h3 className="text-2xl font-black text-gray-950 mb-4">
                  {area.title}
                </h3>

                <p className="text-gray-700">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
              Donation Levels
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-4">
              Every Contribution Matters
            </h2>

            <p className="text-lg text-gray-700">
              Whether large or small, your support contributes to meaningful
              programs and services that benefit the community.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {donationLevels.map((item) => (
              <div
                key={item.amount}
                className="rounded-3xl bg-gray-50 p-8 text-center shadow-premium border card-hover"
              >
                <p className="text-4xl font-black text-gray-950 mb-4">
                  {item.amount}
                </p>

                <p className="font-bold text-red-600">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          <div className="rounded-3xl bg-white p-8 md:p-10 shadow-premium border">
            <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
              Ways to Give
            </p>

            <h2 className="text-3xl font-black text-gray-950 mb-8">
              Donation Options
            </h2>

            <div className="grid gap-4">
              {waysToGive.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400 font-black text-black">
                    ✓
                  </span>

                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-gray-950 p-8 md:p-10 text-white shadow-premium border border-gray-800">
            <p className="text-yellow-400 uppercase tracking-widest font-bold mb-4">
              Transparency
            </p>

            <h2 className="text-3xl font-black mb-6">
              Accountability Matters
            </h2>

            <p className="text-gray-300">
              USBC is committed to responsible stewardship of all donations and
              resources. Contributions are used to support approved programs,
              services, events, and community initiatives that align with the
              Society&apos;s mission and objectives.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gray-950 p-8 md:p-12 text-white shadow-premium md:flex items-center justify-between gap-8">
          <div>
            <p className="text-yellow-400 uppercase tracking-widest font-bold mb-4">
              Make a Difference
            </p>

            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Support Our Community
            </h2>

            <p className="text-gray-300 max-w-3xl">
              Join us in building a stronger, more connected, and empowered
              Ugandan community in British Columbia.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-block mt-8 md:mt-0 rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black hover:bg-yellow-300 transition"
          >
            Donate Now
          </Link>
        </div>
      </section>
    </main>
  );
}