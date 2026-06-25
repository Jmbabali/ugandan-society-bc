import {
  Users,
  CalendarDays,
  BriefcaseBusiness,
  HandHeart,
} from "lucide-react";

const benefits = [
  {
    title: "Community & Networking",
    description:
      "Build lasting friendships and connect with Ugandans and friends of Uganda across British Columbia.",
    icon: Users,
  },
  {
    title: "Events & Culture",
    description:
      "Celebrate Ugandan culture through festivals, family gatherings, sports, workshops, and community events.",
    icon: CalendarDays,
  },
  {
    title: "Business & Careers",
    description:
      "Support Ugandan-owned businesses, discover professional opportunities, and expand your network.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Support & Resources",
    description:
      "Access newcomer guidance, youth programs, community resources, and member support services.",
    icon: HandHeart,
  },
];

export default function WhyJoin() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <p className="mb-4 font-black uppercase tracking-[0.3em] text-red-600">
            WHY JOIN USBC
          </p>

          <h2 className="mb-6 text-4xl font-black text-gray-950 md:text-5xl">
            Be Part of a Community That Cares
          </h2>

          <p className="text-lg leading-8 text-gray-600">
            Whether you're a newcomer, student, professional, entrepreneur,
            family, or long-time resident, USBC offers opportunities to connect,
            grow, celebrate, and give back.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-2xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-100 transition group-hover:bg-yellow-400">
                  <Icon className="h-8 w-8 text-red-600 group-hover:text-black" />
                </div>

                <h3 className="mb-4 text-2xl font-black text-gray-950">
                  {item.title}
                </h3>

                <p className="leading-7 text-gray-600">
                  {item.description}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}