import "./globals.css";
import SiteShell from "./components/SiteShell";
import Script from "next/script";

export const metadata = {
  title: "Ugandan Society in BC",
  description: "Building Connections, Preserving Heritage, Empowering Community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SiteShell>{children}</SiteShell>
        <Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XY5JWEF73X"
  strategy="afterInteractive"
/>

<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XY5JWEF73X');
  `}
</Script>
      </body>
    </html>
  );
}