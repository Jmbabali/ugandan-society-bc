export default function GalleryPage() {
  const galleryAlbums = [
    {
      title: "Cultural Celebrations",
      category: "Culture",
      description:
        "Moments from cultural events celebrating Ugandan heritage, food, music, dance, and traditions.",
    },
    {
      title: "Community Gatherings",
      category: "Community",
      description:
        "Photos from social gatherings, networking activities, family events, and community meetings.",
    },
    {
      title: "Youth Programs",
      category: "Youth",
      description:
        "Highlights from youth engagement, leadership activities, mentorship, and learning opportunities.",
    },
    {
      title: "Sports & Fitness",
      category: "Sports",
      description:
        "Community sports, fitness activities, friendly matches, and wellness events.",
    },
    {
      title: "Newcomer Support",
      category: "Outreach",
      description:
        "Community outreach and support initiatives for newcomers and families settling in British Columbia.",
    },
    {
      title: "Partners & Sponsors",
      category: "Partnerships",
      description:
        "Recognition moments with partners, sponsors, volunteers, and community supporters.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-black px-6 py-28 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(220,38,38,0.25),transparent_30%)]" />

        <div className="relative max-w-7xl mx-auto">
          <p className="text-yellow-400 uppercase tracking-widest font-semibold mb-4">
            Gallery
          </p>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 max-w-5xl leading-tight">
            Capturing Community Moments
          </h1>

          <p className="text-xl text-gray-200 max-w-4xl">
            Explore photos, memories, and highlights from USBC cultural events,
            community gatherings, outreach programs, youth activities, and
            celebrations across British Columbia.
          </p>
        </div>
      </section>

      <section className="px-6 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-red-600 uppercase tracking-widest font-semibold mb-4">
              Photo Albums
            </p>

            <h2 className="text-4xl font-bold text-black mb-4">
              Community Highlights
            </h2>

            <p className="text-lg text-gray-700">
              This gallery will showcase approved photos and videos from USBC
              events, programs, and community activities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {galleryAlbums.map((album) => (
              <div
                key={album.title}
                className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center">
                  <span className="text-gray-500">Photo Coming Soon</span>
                </div>

                <div className="p-8">
                  <p className="text-sm font-semibold uppercase tracking-widest text-red-600 mb-3">
                    {album.category}
                  </p>

                  <h3 className="text-2xl font-bold text-black mb-4">
                    {album.title}
                  </h3>

                  <p className="text-gray-700 mb-6">{album.description}</p>

                  <button className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800">
                    View Album
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <p className="text-red-600 uppercase tracking-widest font-semibold mb-4">
              Submit Photos
            </p>

            <h2 className="text-3xl font-bold text-black mb-6">
              Share Your USBC Moments
            </h2>

            <p className="text-gray-700 mb-6">
              Members and event organizers will be able to submit approved
              photos and videos for inclusion in the gallery. All submissions
              will be reviewed before publication.
            </p>

            <button className="rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800">
              Submit Photos
            </button>
          </div>

          <div className="rounded-3xl border bg-black p-8 text-white shadow-sm">
            <p className="text-yellow-400 uppercase tracking-widest font-semibold mb-4">
              Privacy & Consent
            </p>

            <h2 className="text-3xl font-bold mb-6">
              Respecting Member Privacy
            </h2>

            <p className="text-gray-300">
              USBC will only publish approved photos and videos in accordance
              with member consent, privacy expectations, and event participation
              guidelines.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}