import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-4 gap-10">

          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Ugandan Society in BC
            </h3>

            <p className="text-sm leading-7">
              Building Connections, Preserving Heritage, Empowering Community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              Quick Links
            </h3>

            <div className="space-y-3">
              <Link href="/about" className="block hover:text-yellow-400">
                About
              </Link>

              <Link href="/membership" className="block hover:text-yellow-400">
                Membership
              </Link>

              <Link href="/events" className="block hover:text-yellow-400">
                Events
              </Link>

              <Link href="/gallery" className="block hover:text-yellow-400">
                Gallery
              </Link>
            </div>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              Community
            </h3>

            <div className="space-y-3">
              <Link href="/business-hub" className="block hover:text-yellow-400">
                Business Hub
              </Link>

              <Link href="/partners" className="block hover:text-yellow-400">
                Partners & Sponsors
              </Link>

              <Link href="/resources" className="block hover:text-yellow-400">
                Resources
              </Link>

              <Link href="/donations" className="block hover:text-yellow-400">
                Donations
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              Contact
            </h3>

            <div className="space-y-3 text-sm">
              <p>📧 ugandansocietybc@gmail.com</p>
              <p>📍 British Columbia, Canada</p>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm">
          © 2026 Ugandan Society in BC (USBC). All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}