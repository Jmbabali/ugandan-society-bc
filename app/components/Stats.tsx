"use client";

import CountUp from "react-countup";

const stats = [
  {
    number: 250,
    suffix: "+",
    title: "Members",
  },
  {
    number: 50,
    suffix: "+",
    title: "Businesses",
  },
  {
    number: 20,
    suffix: "+",
    title: "Events",
  },
  {
    number: 100,
    suffix: "+",
    title: "Volunteers",
  },
];

export default function Stats() {
  return (
    <section className="bg-slate-100 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-4 font-black uppercase tracking-widest text-red-600">
            Growing Together
          </p>

          <h2 className="text-4xl font-black text-gray-950">
            Our Community by the Numbers
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl bg-white p-10 text-center shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h3 className="mb-3 text-5xl font-black text-red-600">
                <CountUp
                  end={item.number}
                  duration={2}
                  enableScrollSpy
                  scrollSpyOnce
                />
                {item.suffix}
              </h3>

              <p className="text-lg font-semibold text-gray-700">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}