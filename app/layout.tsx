import "./globals.css";
import SiteShell from "./components/SiteShell";

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
      </body>
    </html>
  );
}