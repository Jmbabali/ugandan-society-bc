import Image from "next/image";

export default function WebmailPage() {
  return (
    <main className="min-h-screen bg-gray-100 px-6 py-16">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-xl">
        <div className="h-2 bg-gradient-to-r from-black via-yellow-400 to-red-600" />

        <div className="grid gap-0 md:grid-cols-2">
          <div className="bg-gray-950 p-10 text-white">
            <Image
              src="/logo.png"
              alt="USBC Logo"
              width={90}
              height={90}
              className="mb-8 rounded-2xl bg-white p-2"
            />

            <p className="font-black uppercase tracking-[0.35em] text-yellow-400">
              Official Email
            </p>

            <h1 className="mt-4 text-5xl font-black leading-tight">
              USBC Webmail
            </h1>

            <p className="mt-5 leading-8 text-gray-300">
              Access official Ugandan Society in BC email services for executive
              communication, administration, events, membership, and community
              coordination.
            </p>

            <a
              href="https://mail.zoho.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-xl bg-yellow-400 px-8 py-4 font-black text-black hover:bg-yellow-300"
            >
              Open Webmail
            </a>
          </div>

          <div className="p-10">
            <h2 className="text-3xl font-black text-gray-950">
              Executive Email Access
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Use your assigned USBC email address and password to sign in.
              Please keep your password private and log out after using a shared
              computer.
            </p>

            <div className="mt-8 space-y-4">
              <InfoCard
                title="Main Society Email"
                value="info@ugandansocietybc.ca"
              />

              <InfoCard
                title="Webmail Provider"
                value="Zoho Mail / Official Mail Service"
              />

              <InfoCard
                title="Support"
                value="Contact the administrator if you cannot access your email."
              />
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-yellow-400 bg-yellow-50 p-5">
              <p className="font-bold text-gray-950">Security reminder</p>
              <p className="mt-2 text-sm leading-6 text-gray-700">
                Do not share official email passwords. If an executive leaves
                office, their email access should be updated or disabled.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-gray-50 p-5">
      <p className="text-sm font-black uppercase tracking-widest text-gray-500">
        {title}
      </p>
      <p className="mt-2 font-bold text-gray-950">{value}</p>
    </div>
  );
}