import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    "Unity",
    "Respect",
    "Integrity",
    "Transparency",
    "Inclusion",
    "Community Service",
    "Cultural Pride",
    "Empowerment",
  ];

  const purposeCards = [
    {
      title: "Supporting Integration",
      text: "Helping Ugandans in British Columbia settle, connect, and participate fully in Canadian society.",
    },
    {
      title: "Community Connection",
      text: "Creating spaces where Ugandans and friends of Uganda can network, collaborate, and support one another.",
    },
    {
      title: "Cultural Preservation",
      text: "Preserving and promoting Ugandan cultures, languages, traditions, values, and heritage across British Columbia.",
    },
    {
      title: "Newcomer Support",
      text: "Supporting new Ugandan immigrants as they adjust, build relationships, and access community resources.",
    },
    {
      title: "Civic Engagement",
      text: "Encouraging active participation, leadership, service, and positive contribution within Canadian communities.",
    },
    {
      title: "Youth & Family Empowerment",
      text: "Supporting families, youth, and future leaders through mentorship, engagement, and community programs.",
    },
  ];

  const executiveTeam = [
    {
      name: "Abbey Nsubuga Kizito",
      role: "Chairperson",
      image: "/executives/abbey-kizito.jpg",
      initials: "AK",
      bio: "Provides strategic leadership and oversight to support the Society’s mission, governance, and long-term growth. Abbey brings professional experience in accounting, taxation, and community service.",
    },
    {
      name: "Louis Maruk",
      role: "Vice Chairperson",
      image: null,
      initials: "LM",
      bio: "Supports the Chairperson in leadership, planning, and community engagement. Louis helps strengthen collaboration and supports initiatives that advance USBC’s mission.",
    },
        {
      name: "Babu Kigongo",
      role: "Treasurer",
      image: null,
      initials: "BK",
      bio: "Oversees financial management, reporting, and responsible stewardship. Babu is also a dedicated community leader and Co-Founder of All-Stars In Africa.",
    },
    {
      name: "John Mbabali",
      role: "Public Relations Officer",
      image: "/executives/john-mbabali.jpg",
      initials: "JM",
      bio: "Leads communications, public engagement, and outreach. John is an entrepreneur, innovator, and Founder of Bytewave Innovations Limited and WOOSH Water Technologies.",
    },
    {
      name: "Marion Nyiransaba",
      role: "Secretary",
      image: null,
      initials: "MN",
      bio: "Oversees organizational records, meeting documentation, and administrative coordination while supporting transparency, accountability, and effective communication.",
    },
    {
      name: "Rose Baliyo",
      role: "Fundraising Coordinator",
      image: "/executives/philda.jpeg",
      initials: "RB",
      bio: "Hilda Baliyo, BSc (Accounting), MBA is an accounting and business professional with expertise in finance, administration, and strategic management. She holds a Bachelor of Science in Accounting and an MBA from University Canada West. As an Administrator at Gallant Law Corporation in Prince George, she oversees financial and administrative operations, including trust accounting, payroll, client services, and office management. Hilda is committed to integrity, excellence, and supporting the growth and success of the Ugandan community in British Columbia.",
    },
    {
      name: "Jackie Nakitende",
      role: "Welfare Coordinator",
      image: null,
      initials: "JN",
      bio: "Supports member well-being through welfare initiatives, community care, and member engagement programs that foster inclusion and belonging.",
    },
    {
      name: "Martin Ssemiriyo",
      role: "Events Coordinator",
      image: null,
      initials: "MS",
      bio: "Leads the planning and delivery of cultural, social, and community events that strengthen connections and celebrate Ugandan heritage.",
    },
    {
      name: "George Kagugube",
      role: "Sports & Fitness Coordinator",
      image: null,
      initials: "GK",
      bio: "Promotes health, wellness, sports, recreation, teamwork, and active participation across the USBC community.",
    },
    {
      name: "Rogers Sserubiri",
      role: "Culture & Diversity Coordinator",
      image: null,
      initials: "RS",
      bio: "Champions cultural preservation, diversity, inclusion, and intercultural engagement while celebrating Uganda’s rich heritage.",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="relative overflow-hidden bg-gray-950 px-6 py-24 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-yellow-400 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-red-600 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <p className="mb-4 font-black uppercase tracking-[0.35em] text-yellow-400">
            Who We Are
          </p>

          <h1 className="max-w-5xl text-4xl font-black leading-tight md:text-7xl">
            Building Connections, Preserving Heritage, Empowering Community
          </h1>

          <p className="mt-8 max-w-4xl text-lg leading-8 text-gray-300 md:text-xl">
            The Ugandan Society in BC (USBC) is a non-profit, non-partisan
            community organization dedicated to fostering unity, cultural pride,
            service, and meaningful engagement among Ugandans and friends of
            Uganda across British Columbia.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/membership"
              className="rounded-xl bg-yellow-400 px-7 py-4 font-black text-black hover:bg-yellow-300"
            >
              Become a Member
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-white/20 bg-white/10 px-7 py-4 font-black text-white hover:bg-white/20"
            >
              Contact USBC
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          <div>
            <p className="mb-4 font-black uppercase tracking-widest text-red-600">
              Our Mission
            </p>

            <h2 className="text-3xl font-black text-gray-950 md:text-5xl">
              A welcoming, safe, and empowering community.
            </h2>
          </div>

          <div className="rounded-3xl bg-gray-950 p-8 text-white shadow-xl lg:col-span-2 md:p-10">
            <p className="text-xl leading-9 text-gray-200 md:text-2xl">
              We strive to create a welcoming and safe environment where
              community members feel connected, supported, and empowered to
              participate in their community and live meaningful lives.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 font-black uppercase tracking-widest text-red-600">
              Our Values
            </p>

            <h2 className="mb-4 text-3xl font-black text-gray-950 md:text-5xl">
              The Principles That Guide Us
            </h2>

            <p className="text-lg leading-8 text-gray-700">
              These values shape how we serve, lead, communicate, and build
              trust within the community.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {values.map((value) => (
              <div
                key={value}
                className="rounded-3xl border bg-gray-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 font-black text-black">
                  ✓
                </div>

                <h3 className="text-xl font-black text-gray-950">{value}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 font-black uppercase tracking-widest text-red-600">
              Our Purpose
            </p>

            <h2 className="mb-4 text-3xl font-black text-gray-950 md:text-5xl">
              Strengthening Community Through Service and Culture
            </h2>

            <p className="text-lg leading-8 text-gray-700">
              USBC exists to support integration, preserve culture, strengthen
              community connection, and encourage participation in Canadian
              society.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {purposeCards.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-950 font-black text-yellow-400">
                  ✓
                </div>

                <h3 className="mb-3 text-2xl font-black text-gray-950">
                  {item.title}
                </h3>

                <p className="leading-7 text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-4xl">
            <p className="mb-4 font-black uppercase tracking-widest text-red-600">
              Executive Committee
            </p>

            <h2 className="mb-4 text-3xl font-black text-gray-950 md:text-5xl">
              Meet the Leadership Team
            </h2>

            <p className="text-lg leading-8 text-gray-700">
              USBC is led by community leaders committed to service,
              accountability, transparency, and community development.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {executiveTeam.map((member) => (
              <div
                key={member.name}
                className="overflow-hidden rounded-3xl border bg-gray-50 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-2 bg-gradient-to-r from-black via-yellow-400 to-red-600" />

                <div className="p-8">
                  <div className="mb-6 flex items-center gap-5">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-3xl border bg-gray-200">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-950 text-2xl font-black text-yellow-400">
                          {member.initials}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-gray-950">
                        {member.name}
                      </h3>

                      <p className="mt-1 text-sm font-black uppercase tracking-wide text-red-600">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <p className="leading-7 text-gray-700">{member.bio}</p>

                  <div className="mt-6 border-t pt-4 text-sm font-bold text-gray-500">
                    Executive Committee
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 font-black uppercase tracking-widest text-red-600">
              Governance
            </p>

            <h2 className="mb-4 text-3xl font-black text-gray-950 md:text-5xl">
              Leadership Structure
            </h2>

            <p className="text-lg leading-8 text-gray-700">
              USBC operates through a structured leadership model that supports
              accountability, oversight, and effective community service.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Board of Trustees",
                text: "Provides oversight and governance support.",
              },
              {
                title: "Executive Committee",
                text: "Leads operations, planning, and implementation.",
              },
              {
                title: "Coordinators & Committees",
                text: "Support programs, events, welfare, culture, sports, and fundraising.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <h3 className="mb-4 text-2xl font-black text-gray-950">
                  {item.title}
                </h3>

                <p className="leading-7 text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-950 px-6 py-20 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/10 p-8 shadow-xl md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <p className="mb-4 font-black uppercase tracking-widest text-yellow-400">
              Constitution & Bylaws
            </p>

            <h2 className="mb-4 text-3xl font-black md:text-5xl">
              Guided by Clear Governance
            </h2>

            <p className="max-w-3xl leading-8 text-gray-300">
              USBC is guided by its Constitution and Bylaws, which outline the
              organization’s mission, objectives, membership, leadership
              structure, elections, governance, and accountability.
            </p>
          </div>

          <Link
            href="/resources"
            className="rounded-xl bg-yellow-400 px-8 py-4 text-center font-black text-black hover:bg-yellow-300"
          >
            View Constitution
          </Link>
        </div>
      </section>
    </main>
  );
}