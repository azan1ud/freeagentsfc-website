import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreeAgentsFC — Get seen. Get signed.",
  description:
    "The UK football marketplace where free agents, coaches, clubs and scouts find each other. 1,491 members, 6,474 connections and 742 real opportunities in month one. Free on iOS and Android.",
  openGraph: {
    title: "FreeAgentsFC — Get seen. Get signed.",
    description:
      "The UK football marketplace where free agents, coaches, clubs and scouts find each other. Real profiles, real trials, real conversations that turn into contracts.",
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
