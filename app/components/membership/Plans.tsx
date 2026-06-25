const plans = [
  {
    title: "Adult",
    price: "$50",
    description: "For individuals who want to actively participate in the Ugandan community.",
    features: [
      "Voting rights",
      "Discounted event tickets",
      "Community networking",
      "Access to members-only activities",
    ],
  },
  {
    title: "Student",
    price: "$30",
    description: "Affordable membership for full-time students.",
    features: [
      "Student networking",
      "Career mentorship",
      "Leadership opportunities",
      "Discounted events",
    ],
  },
  {
    title: "Corporate",
    price: "$200",
    description: "For businesses and organizations supporting USBC.",
    features: [
      "Business promotion",
      "Sponsor opportunities",
      "Networking events",
      "Recognition on USBC website",
    ],
  },
  {
    title: "Honorary",
    price: "Free",
    description: "Awarded by the Board for distinguished service.",
    features: [
      "Recognition",
      "Community participation",
      "Special invitations",
      "Lifetime appreciation",
    ],
  },
];

export default function MembershipPlans() {
  return (
    <section id="plans" className="bg-gray-100 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="font-black uppercase tracking-[0.3em] text-red-600">
            Membership Plans
          </p>

          <h2 className="mt-4 text-5xl font-black text-gray-950">
            Choose Your Membership
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-600">
            Select the membership that best fits your needs and become part of
            British Columbia's growing Ugandan community.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <h3 className="text-3xl font-black">{plan.title}</h3>

              <p className="mt-4 text-5xl font-black text-red-600">
                {plan.price}
              </p>

              <p className="mt-4 text-gray-600">
                {plan.description}
              </p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-gray-700">
                    ✓ {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#application"
                className="mt-8 block rounded-xl bg-gray-950 py-4 text-center font-bold text-white transition hover:bg-red-600"
              >
                Apply Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}