import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0b0b0b] text-white">
      <div className="h-1 w-full bg-gradient-to-r from-black via-yellow-400 to-red-600" />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-10 border-b border-white/10 pb-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Image src="/logo.png" alt="USBC Logo" width={58} height={58} />

              <div>
                <h3 className="text-lg font-black">Ugandan Society</h3>
                <p className="font-black text-yellow-400">in BC</p>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-7 text-gray-300">
              Connecting Ugandans and friends of Uganda across British Columbia
              through culture, community service, networking, business support,
              and meaningful engagement.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-black text-yellow-400">Explore</h3>

            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/about" className="hover:text-yellow-400">About Us</Link></li>
              <li><Link href="/membership" className="hover:text-yellow-400">Membership</Link></li>
              <li><Link href="/events" className="hover:text-yellow-400">Events</Link></li>
              <li><Link href="/gallery" className="hover:text-yellow-400">Gallery</Link></li>
              <li><Link href="/resources" className="hover:text-yellow-400">Resources</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-black text-yellow-400">Community</h3>

            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/business-hub" className="hover:text-yellow-400">Business Hub</Link></li>
              <li><Link href="/partners" className="hover:text-yellow-400">Partners & Sponsors</Link></li>
              <li><Link href="/donations" className="hover:text-yellow-400">Donations</Link></li>
              <li><Link href="/contact" className="hover:text-yellow-400">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-black text-yellow-400">Contact</h3>

            <div className="space-y-3 text-sm text-gray-300">
              <p>ugandansocietybc@gmail.com</p>
              <p>British Columbia, Canada</p>

              <div className="mt-5 border-t border-white/10 pt-5 leading-7">
                <p>Building Connections.</p>
                <p>Preserving Heritage.</p>
                <p>Empowering Community.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-5 pt-6 text-center md:flex-row md:text-left">
          <p className="text-sm text-gray-400">
            © 2026 Ugandan Society in BC (USBC). All Rights Reserved.
          </p>

          <p className="text-sm text-gray-400">
            Proudly Connecting Our Community
          </p>

          <a
            href="https://bytewaveinnovations.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 transition hover:scale-105"
          >
            <span className="text-sm text-gray-400">
              Website Designed & Powered By
            </span>

            <Image
              src="/partners/bytewave.png"
              alt="Bytewave Innovations"
              width={140}
              height={45}
              className="h-9 w-auto"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}