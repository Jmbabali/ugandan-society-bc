import {
  Users,
  CalendarDays,
  BriefcaseBusiness,
  HandHeart,
} from "lucide-react";

const benefits = [
  {
    title: "Community Connection",
    text: "Meet Ugandans and friends of Uganda across British Columbia.",
    icon: Users,
  },
  {
    title: "Events & Culture",
    text: "Join cultural events, celebrations, workshops, and community programs.",
    icon: CalendarDays,
  },
  {
    title: "Business Network",
    text: "Connect with Ugandan-owned businesses, professionals, and partners.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Member Support",
    text: "Access newcomer guidance, referrals, youth support, and community resources.",
    icon: HandHeart,
  },
];

export default function MembershipBenefits() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-4 font-black uppercase tracking-[0.3em] text-red-600">
            Membership Benefits
          </p>

          <h2 className="mb-6 text-4xl font-black text-gray-950 md:text-5xl">
            Why Become a USBC Member?
          </h2>

          <p className="text-lg leading-8 text-gray-600">
            Membership gives you access to community connections, cultural
            programs, business opportunities, and support services.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border bg-gray-50 p-8 text-center shadow-md transition hover:-translate-y-2 hover:border-yellow-400 hover:shadow-xl"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-100">
                  <Icon className="h-8 w-8 text-red-600" />
                </div>

                <h3 className="mb-3 text-2xl font-black text-gray-950">
                  {item.title}
                </h3>

                <p className="leading-7 text-gray-600">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}