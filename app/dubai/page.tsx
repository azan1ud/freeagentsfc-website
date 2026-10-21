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

        {/* What the showcase includes (Kamal's list, 16 Oct). */}
        <ul
          className="rise mt-8 space-y-3 text-sm"
          style={{ ["--d" as string]: "0.32s" }}
        >
          {[
            ["⚽", "4 full 11-a-side games", "All filmed, all played on Elite Quality Grass in front of UAE clubs from the Pro League down"],
            ["📈", "Additional coaching throughout the week", "Plus fitness testing with Lyon's Den"],
            ["🎥", "All games recorded", "Final day broadcast live, your own highlight reel and a performance report"],
            ["🤝", "Club meetings on day 9", "Right as the UAE January window opens"],
            ["🏨", "Food, hotel, airport transfers and daily transport", "All included"],
          ].map(([icon, big, small]) => (
            <li key={big} className="flex gap-4 rounded-2xl border border-white/10 bg-card p-4">
              <span className="text-xl leading-none" aria-hidden>{icon}</span>
              <div>
                <p className="font-semibold text-white">{big}</p>
                <p className="mt-1 text-white/55">{small}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Brochure download (two editions, no public price: the fee comes with each invitation). */}
        <section
          className="rise mt-6 rounded-2xl border border-lime/30 bg-card p-5"
          style={{ ["--d" as string]: "0.4s" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime">
            The brochure
          </p>
          <p className="mt-2 font-semibold text-white">
            See everything about the ten days before you apply
          </p>
          <p className="mt-1 text-sm text-white/55">
            The format, the schedule, the clubs watching, the hotel and what&apos;s included. PDF, 17 pages.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            {[
              ["/dubai/FreeAgentsFC_Dubai_Showcase_Brochure_UK.pdf", "UK edition"],
              ["/dubai/FreeAgentsFC_Dubai_Showcase_Brochure_ME.pdf", "Middle East edition"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                download
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-ink transition hover:brightness-110"
              >
                <span aria-hidden>↓</span> {label}
              </a>
            ))}
          </div>
        </section>

        <ApplyForm />
      </div>
    </main>
  );
}
