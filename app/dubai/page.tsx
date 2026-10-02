import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ApplyForm from "./ApplyForm";

export const metadata: Metadata = {
  title: "Dubai · The Free Agent Showcase · Apply · FreeAgentsFC",
  description:
    "Apply for a place at the FreeAgentsFC Free Agent Showcase in Dubai.",
  openGraph: {
    title: "FreeAgentsFC Dubai · The Free Agent Showcase",
    description:
      "Apply for a place at the FreeAgentsFC Free Agent Showcase in Dubai.",
    url: "https://freeagentsfc.com/dubai",
    siteName: "FreeAgentsFC",
    type: "website",
  },
};

export default function DubaiPage() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <div className="mx-auto max-w-2xl px-5 pb-24 pt-8 sm:px-6 lg:pt-12">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="FreeAgentsFC"
            width={32}
            height={32}
            className="rounded-lg"
            priority
          />
          <span className="text-sm font-semibold text-white/80">
            FreeAgentsFC
          </span>
        </Link>

        <header className="mt-12 lg:mt-16">
          <p className="rise text-xs font-bold uppercase tracking-[0.2em] text-lime">
            Application
          </p>
          <h1
            className="rise mt-3 font-display text-6xl uppercase leading-[0.9] sm:text-7xl"
            style={{ ["--d" as string]: "0.08s" }}
          >
            Dubai
          </h1>
          <p
            className="rise mt-4 text-lg font-semibold text-white/90"
            style={{ ["--d" as string]: "0.16s" }}
          >
            The Free Agent Showcase
          </p>
          <p
            className="rise mt-3 max-w-lg text-white/60"
            style={{ ["--d" as string]: "0.24s" }}
          >
            Tell us about you and your football. It takes about two minutes.
            We&apos;ll message you on WhatsApp.
          </p>
        </header>

        <ApplyForm />
      </div>
    </main>
  );
}
