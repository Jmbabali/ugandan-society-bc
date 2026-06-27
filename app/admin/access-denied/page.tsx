import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <div className="max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">
        <p className="mb-4 font-bold uppercase tracking-widest text-red-600">
          Access Denied
        </p>

        <h1 className="mb-4 text-4xl font-black text-gray-950">
          You do not have permission
        </h1>

        <p className="mb-8 text-gray-700">
          Your admin role does not allow access to this page. Contact the Super
          Admin if you believe this is an error.
        </p>

        <Link
          href="/admin/dashboard"
          className="inline-block rounded-xl bg-gray-950 px-8 py-4 font-bold text-white hover:bg-gray-800"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}