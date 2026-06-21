import Link from "next/link";

export default function BusinessHubPage() {
  const categories = [
    "Accounting & Tax",
    "Technology",
    "Real Estate",
    "Legal Services",
    "Healthcare",
    "Transportation",
    "Construction",
    "Cleaning Services",
    "Restaurants & Catering",
    "Retail",
    "Beauty & Wellness",
    "Consulting",
  ];

  const featuredBusinesses = [
    {
      name: "Bytewave Innovations Limited",
      category: "Technology & Business Solutions",
      city: "Surrey, BC",
      description:
        "Providing technology, digital solutions, business support, and innovation services.",
      initials: "BI",
    },
    {
      name: "All-Stars In Africa",
      category: "Youth Development & Sports",
      city: "Canada / Uganda",
      description:
        "Supporting youth development, mentorship, leadership, and community impact through sports programs.",
      initials: "AS",
    },
    {
      name: "Business Listing Coming Soon",
      category: "Community Business",
      city: "British Columbia",
      description:
        "Ugandan-owned and community-supporting businesses will be featured here.",
      initials: "USBC",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gray-950 px-6 py-20 text-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-yellow-400 uppercase tracking-widest font-bold mb-4">
            Business Hub
          </p>

          <h1 className="text-4xl md:text-6xl font-black mb-6 max-w-5xl">
            Connecting Ugandan Businesses, Professionals, and Entrepreneurs
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
            A platform for promoting Ugandan-owned businesses, professional
            services, entrepreneurship, partnerships, and economic empowerment
            across British Columbia.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
              Featured Businesses
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-4">
              Community Business Directory
            </h2>

            <p className="text-lg text-gray-700">
              Discover Ugandan-owned businesses, professionals, entrepreneurs,
              and community-supporting organizations across British Columbia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredBusinesses.map((business) => (
              <div
                key={business.name}
                className="rounded-3xl bg-white p-8 shadow-premium border card-hover"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 font-black text-black">
                  {business.initials}
                </div>

                <h3 className="text-2xl font-black text-gray-950 mb-2">
                  {business.name}
                </h3>

                <p className="font-bold text-red-600 mb-2">
                  {business.category}
                </p>

                <p className="text-sm text-gray-500 mb-4">{business.city}</p>

                <p className="text-gray-700 mb-6">{business.description}</p>

                <button className="rounded-xl bg-gray-950 px-5 py-3 text-sm font-bold text-white hover:bg-gray-800 transition">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
              Categories
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-4">
              Find Services by Category
            </h2>

            <p className="text-lg text-gray-700">
              Businesses can be listed by service category to help members and
              the wider community find trusted providers.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            {categories.map((category) => (
              <div
                key={category}
                className="rounded-2xl bg-gray-50 p-6 shadow-premium border card-hover"
              >
                <h3 className="font-black text-gray-950">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          <div className="rounded-3xl bg-white p-8 md:p-10 shadow-premium border">
            <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
              For Business Owners
            </p>

            <h2 className="text-3xl font-black text-gray-950 mb-6">
              List Your Business
            </h2>

            <p className="text-gray-700 mb-6">
              USBC members and community partners will be able to submit their
              businesses for listing in the Business Hub. Listings may include a
              business name, logo, category, city, contact details, website,
              description, and services offered.
            </p>

            <Link
              href="/contact"
              className="inline-block rounded-xl bg-gray-950 px-6 py-4 font-bold text-white hover:bg-gray-800 transition"
            >
              Submit Business
            </Link>
          </div>

          <div className="rounded-3xl bg-gray-950 p-8 md:p-10 text-white shadow-premium border border-gray-800">
            <p className="text-yellow-400 uppercase tracking-widest font-bold mb-4">
              Corporate Members
            </p>

            <h2 className="text-3xl font-black mb-6">
              Featured Listings & Sponsorship
            </h2>

            <p className="text-gray-300 mb-6">
              Corporate and partner members can access featured listings,
              promotional opportunities, event sponsorship visibility, and
              partnership recognition through USBC platforms.
            </p>

            <Link
              href="/partners"
              className="inline-block rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black hover:bg-yellow-300 transition"
            >
              Become a Partner
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}