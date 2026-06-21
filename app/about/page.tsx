import Image from "next/image";

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
      text: "Helping Ugandans in British Columbia participate fully in Canadian society.",
    },
    {
      title: "Community Connection",
      text: "Promoting understanding, cooperation, and meaningful engagement among Ugandans and friends of Uganda.",
    },
    {
      title: "Cultural Preservation",
      text: "Preserving and promoting Ugandan cultures, traditions, and heritage in British Columbia.",
    },
    {
      title: "Newcomer Support",
      text: "Assisting new Ugandan immigrants as they adjust, settle, and participate in BC communities.",
    },
    {
      title: "Civic Engagement",
      text: "Encouraging active participation and positive contribution within Canadian communities.",
    },
  ];

  const executiveTeam = [
    {
      name: "Abbey Nsubuga Kizito",
      role: "Chairperson",
      image: "/executives/abbey-kizito.jpg",
      initials: "AK",
      bio: "Provides strategic leadership and oversight to support the Society’s mission and growth. A professional specializing in accounting and taxation, Abbey combines strong analytical expertise with a passion for community engagement, collaboration, and service.",
    },
    {
      name: "Louis Maruk",
      role: "Vice Chairperson",
      image: null,
      initials: "LM",
      bio: "Supports the Chairperson in providing leadership and strategic direction for the Society. Louis is committed to strengthening community engagement, promoting collaboration, and supporting initiatives that advance USBC’s mission.",
    },
    {
      name: "Marion Nyiransaba",
      role: "Secretary",
      image: null,
      initials: "MN",
      bio: "Oversees organizational records, meeting documentation, and administrative coordination. Marion plays a vital role in supporting transparency, accountability, and effective communication.",
    },
    {
      name: "Babu Kigongo",
      role: "Treasurer",
      image: null,
      initials: "BK",
      bio: "Oversees the Society’s financial management and supports long-term sustainability. A dedicated community leader and Co-Founder of All-Stars In Africa, Babu is passionate about youth development, mentorship, accountability, and responsible stewardship.",
    },
    {
      name: "John Mbabali",
      role: "Public Relations Officer",
      image: "/executives/john-mbabali.jpg",
      initials: "JM",
      bio: "Leads communications, public engagement, and community outreach initiatives. An entrepreneur, innovator, and community leader, John is the Founder of Bytewave Innovations Limited and WOOSH Water Technologies.",
    },
    {
      name: "Rose Baliyo",
      role: "Fundraising Coordinator",
      image: null,
      initials: "RB",
      bio: "Coordinates fundraising initiatives and sponsorship opportunities that support community programs and events. Rose works with partners, donors, and supporters to help strengthen the Society’s impact.",
    },
    {
      name: "Jackie Nakitende",
      role: "Welfare Coordinator",
      image: null,
      initials: "JN",
      bio: "Supports the well-being of members through welfare initiatives, community support programs, and member engagement activities. Jackie is committed to fostering a caring and inclusive environment.",
    },
    {
      name: "Martin Ssemiriyo",
      role: "Events Coordinator",
      image: null,
      initials: "MS",
      bio: "Leads the planning and delivery of cultural, social, and community events. Martin is committed to creating engaging experiences that strengthen community connections and celebrate Ugandan heritage.",
    },
    {
      name: "George Kagugube",
      role: "Sports & Fitness Coordinator",
      image: null,
      initials: "GK",
      bio: "Promotes health, wellness, and community engagement through sports and recreational activities. George encourages active participation, healthy lifestyles, teamwork, and community spirit.",
    },
    {
      name: "Rogers Sserubiri",
      role: "Culture & Diversity Coordinator",
      image: null,
      initials: "RS",
      bio: "Champions cultural preservation, diversity, and inclusion initiatives. Rogers works to celebrate Uganda’s rich cultural heritage while promoting understanding, respect, and intercultural engagement.",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero */}
      <section className="bg-gray-950 px-6 py-20 text-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-yellow-400 uppercase tracking-widest font-bold mb-4">
            Who We Are
          </p>

          <h1 className="text-4xl md:text-6xl font-black mb-6 max-w-5xl">
            Building Connections, Preserving Heritage, Empowering Community
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-4xl">
            The Ugandan Society in BC (USBC) is a non-profit, non-partisan
            community organization dedicated to fostering unity, cultural pride,
            and meaningful engagement among Ugandans and friends of Uganda
            across British Columbia.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          <div>
            <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
              Our Mission
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-gray-950">
              A welcoming, safe, and empowering community.
            </h2>
          </div>

          <div className="lg:col-span-2 rounded-3xl bg-gray-950 p-8 md:p-10 text-white shadow-premium">
            <p className="text-xl md:text-2xl leading-relaxed text-gray-200">
              “We strive to create a welcoming and safe environment where
              community members feel connected, supported, and empowered to
              participate in their community and live meaningful and robust
              lives.”
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
              Our Values
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-4">
              The Principles That Guide Us
            </h2>

            <p className="text-lg text-gray-700">
              Our values shape how we serve, lead, communicate, and build trust
              within the community.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value}
                className="rounded-3xl bg-gray-50 p-6 shadow-premium border card-hover"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 font-black text-black">
                  ✓
                </div>

                <h3 className="text-xl font-black text-gray-950">{value}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Purpose */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
              Our Purpose
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-4">
              Strengthening Community Through Service and Culture
            </h2>

            <p className="text-lg text-gray-700">
              USBC exists to support integration, preserve culture, strengthen
              community connection, and encourage participation in Canadian
              society.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purposeCards.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl bg-white p-8 shadow-premium border card-hover"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gray-950 font-black text-yellow-400">
                  ✓
                </div>

                <h3 className="text-2xl font-black text-gray-950 mb-3">
                  {item.title}
                </h3>

                <p className="text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Team */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
              Executive Committee
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-4">
              Meet the Leadership Team
            </h2>

            <p className="text-lg text-gray-700">
              USBC is led by community leaders committed to service,
              accountability, transparency, and community development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {executiveTeam.map((member) => (
              <div
                key={member.name}
                className="rounded-3xl bg-gray-50 p-8 shadow-premium border card-hover"
              >
                <div className="mb-6 flex items-center gap-5">
                  <div className="h-24 w-24 overflow-hidden rounded-2xl border bg-gray-200 shrink-0">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-950 text-yellow-400 text-2xl font-black">
                        {member.initials}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-gray-950">
                      {member.name}
                    </h3>

                    <p className="mt-1 text-sm font-bold text-red-600">
                      {member.role}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700">{member.bio}</p>

                <div className="mt-6 border-t pt-4 text-sm font-bold text-gray-500">
                  Executive Committee
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
              Governance
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-4">
              Leadership Structure
            </h2>

            <p className="text-lg text-gray-700">
              USBC operates through a structured leadership model that supports
              accountability, oversight, and effective community service.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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
                className="rounded-3xl bg-white p-8 shadow-premium border card-hover"
              >
                <h3 className="text-2xl font-black text-gray-950 mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Constitution */}
      <section className="px-6 py-20 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto rounded-3xl border border-white/10 bg-white/10 p-8 md:p-12 shadow-premium md:flex items-center justify-between gap-8">
          <div>
            <p className="text-yellow-400 uppercase tracking-widest font-bold mb-4">
              Constitution & Bylaws
            </p>

            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Guided by Clear Governance
            </h2>

            <p className="text-gray-300 max-w-3xl">
              USBC is guided by its Constitution and Bylaws, which outline the
              organization’s mission, objectives, membership, leadership
              structure, elections, governance, and accountability.
            </p>
          </div>

          <button className="mt-8 md:mt-0 rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black hover:bg-yellow-300 transition">
            View Constitution
          </button>
        </div>
      </section>
    </main>
  );
}