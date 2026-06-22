import Link from "next/link";

export default function DonationSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
      <div className="max-w-2xl rounded-3xl bg-white p-12 text-center shadow-2xl">
        <div className="mb-6 text-6xl">🎉</div>

        <p className="mb-3 font-bold uppercase tracking-widest text-yellow-500">
          Donation Successful
        </p>

        <h1 className="mb-6 text-4xl font-black text-gray-950">
          Thank You For Your Support
        </h1>

        <p className="mb-8 text-lg text-gray-600">
          Your donation has been received successfully.
          Thank you for helping the Ugandan Society in BC support
          community programs, cultural events, youth initiatives,
          newcomer support, and community development.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-xl bg-gray-950 px-8 py-4 font-bold text-white hover:bg-gray-800"
          >
            Return Home
          </Link>

          <Link
            href="/events"
            className="rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black hover:bg-yellow-300"
          >
            View Events
          </Link>
        </div>
      </div>
    </main>
  );
}