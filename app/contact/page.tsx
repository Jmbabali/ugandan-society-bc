import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gray-950 px-6 py-20 text-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-yellow-400 uppercase tracking-widest font-bold mb-4">
            Contact Us
          </p>

          <h1 className="text-4xl md:text-6xl font-black mb-6">
            We&apos;re Here to Help
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
            Have questions about membership, events, partnerships,
            sponsorships, volunteering, or community programs? Reach out to
            the Ugandan Society in BC.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white p-8 shadow-premium border card-hover">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-2xl">
              📧
            </div>

            <h3 className="text-2xl font-black text-gray-950 mb-3">
              Email Us
            </h3>

            <p className="text-gray-700 mb-4">
              For general inquiries, membership questions, and community
              information.
            </p>

            <a
              href="mailto:ugandansocietybc@gmail.com"
              className="font-bold text-red-600 break-all"
            >
              ugandansocietybc@gmail.com
            </a>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-premium border card-hover">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-2xl">
              📍
            </div>

            <h3 className="text-2xl font-black text-gray-950 mb-3">
              Location
            </h3>

            <p className="text-gray-700">
              Serving Ugandans, families, newcomers, professionals, and friends
              of Uganda across British Columbia, Canada.
            </p>
          </div>

          <div className="rounded-3xl bg-gray-950 p-8 shadow-premium border border-gray-800 text-white card-hover">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-2xl">
              🤝
            </div>

            <h3 className="text-2xl font-black mb-3">
              Partnerships
            </h3>

            <p className="text-gray-300">
              Interested in sponsoring an event, supporting a program, or
              partnering with USBC? We would love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <p className="text-red-600 uppercase tracking-widest font-bold mb-4">
              Send a Message
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-6">
              Get in Touch
            </h2>

            <p className="text-lg text-gray-700 mb-8">
              Complete the form and a member of the USBC team will respond.
              For now, this form is a design placeholder. Once connected, it can
              send messages directly to the official USBC email.
            </p>

            <div className="rounded-3xl bg-gray-950 p-8 text-white shadow-premium">
              <p className="text-yellow-400 uppercase tracking-widest font-bold mb-4">
                Current Official Email
              </p>

              <p className="text-2xl font-black break-all">
                ugandansocietybc@gmail.com
              </p>

              <p className="text-gray-300 mt-4">
                Until the website form is connected, members and visitors can
                contact USBC directly through this email address.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-gray-50 p-8 md:p-10 shadow-premium border">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-bold text-gray-700">
                    First Name
                  </label>

                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-gray-950 outline-none focus:border-red-600"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-gray-700">
                    Last Name
                  </label>

                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-gray-950 outline-none focus:border-red-600"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-gray-950 outline-none focus:border-red-600"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  Subject
                </label>

                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-gray-950 outline-none focus:border-red-600"
                  placeholder="Membership Inquiry"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  Message
                </label>

                <textarea
                  rows={6}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-gray-950 outline-none focus:border-red-600"
                  placeholder="Type your message here..."
                />
              </div>

              <button
                type="button"
                className="w-full rounded-xl bg-gray-950 px-8 py-4 font-bold text-white hover:bg-gray-800 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gray-950 p-8 md:p-12 text-white shadow-premium md:flex items-center justify-between gap-8">
          <div>
            <p className="text-yellow-400 uppercase tracking-widest font-bold mb-4">
              Join Our Community
            </p>

            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Become part of USBC
            </h2>

            <p className="text-gray-300 max-w-3xl">
              Join a growing network of Ugandans and friends of Uganda across
              British Columbia.
            </p>
          </div>

          <Link
            href="/membership"
            className="inline-block mt-8 md:mt-0 rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black hover:bg-yellow-300 transition"
          >
            Become a Member
          </Link>
        </div>
      </section>
    </main>
  );
}