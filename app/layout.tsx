import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreeAgentsFC — Where players get scouted",
  description:
    "Get scouted, find clubs, and connect with coaches across the UK football pyramid. Download FreeAgentsFC on iOS and Android.",
  openGraph: {
    title: "FreeAgentsFC — Where players get scouted",
    description:
      "Get scouted, find clubs, and connect with coaches across the UK football pyramid.",
    url: "https://freeagentsfc.com",
    siteName: "FreeAgentsFC",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@FreeAgentsFC1",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
