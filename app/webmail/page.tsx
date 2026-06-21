export default function WebmailPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-lg p-10 text-center">
        <h1 className="text-4xl font-bold text-black mb-4">
          USBC Webmail
        </h1>

        <p className="text-gray-600 mb-8">
          Access official Ugandan Society in BC email services.
        </p>

        <a
          href="#"
          className="inline-block bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Open Webmail
        </a>
      </div>
    </main>
  );
}