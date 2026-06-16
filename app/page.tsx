"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// ─── Single source of truth ───────────────────────────────────────────

const APP_STORE_URL =
  "https://apps.apple.com/gb/app/freeagentsfc/id6765511407";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.freeagentsfc.app";
const TWITTER_URL = "https://x.com/FreeAgentsFC1";

// Real production numbers — counted from the live database, 11 Jun 2026.
// If a number isn't true, it doesn't ship.
const PROOF = {
  members: 1491,
  connections: 6474,
  numbersSwapped: 389,
  chatsThatLed: 742,
  trials: 38,
  applications: 89,
};

// Real, current trial posts (titles + live applicant counts).
const TICKER_TRIALS = [
  "Sporting Bengal United — Step 5 Trials · 15 applied",
  "Barnes FC Trials · 6 applied",
  "Crawley Green FC Open Trial Day · 7 applied",
  "Maidenhead Town Trial Day · 4 applied",
  "Darlington FC U23s Trial",
  "Dagenham United FC Trials · 4 applied",
  "Stotfold FC Reserve Team Open Trial",
  "Kulture FC Pre-Season Open Training",
  "Corinthian FC U23 Trials",
  "BAKERS 693 Open Training Session · 5 applied",
];

// Real in-app feedback, verbatim.
const QUOTES = [
  {
    big: true,
    text:
      "Finally getting seen by clubs at the level I'm actually looking for. My dad told me this would help — and it has.",
    who: "Player",
    role: "Free agent",
  },
  {
    text: "Managed to get a few decent offers on the back of that app mate — nice one.",
    who: "Player",
    role: "Got offers",
  },
  {
    text: "Oi, your app is unbelievable btw — Game Changer ‼️",
    who: "Member",
    role: "Early member",
  },
  {
    text: "No bother, what a class app by the way.",
    who: "Player",
    role: "Member",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <Nav />
      <Hero />
      <TrialsTicker />
      <Proof />
      <TwoSides />
      <Testimonials />
      <YourMove />
      <Footer />
    </main>
  );
}

// ─── Shared bits ──────────────────────────────────────────────────────

/** Scroll-reveal wrapper — adds .is-in when ~15% visible. */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Counts from 0 → `to` the first time it scrolls into view. */
function Count({ to, className = "" }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1700;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          const ease = 1 - Math.pow(1 - p, 4); // ease-out-quart
          setVal(Math.round(to * ease));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return (
    <span ref={ref} className={className}>
      {val.toLocaleString("en-GB")}
    </span>
  );
}

function RatingChip({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full border border-lime/35 bg-[#12160e] px-4 py-2 ${className}`}
    >
      <span className="text-[13px] tracking-[0.2em] text-lime">★★★★★</span>
      <span className="text-[12px] font-extrabold tracking-tight text-white">
        5.0 · 28 ratings
      </span>
    </span>
  );
}

// Store badges — drawn in-palette (mono glyphs on hairline surfaces) so
// they belong to the page instead of shouting their own colours.
function StoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Link
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener"
        className="group flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.03] px-5 py-3 transition hover:border-lime/50 hover:bg-white/[0.06]"
      >
        <svg viewBox="0 0 384 512" className="h-7 w-7 fill-white" aria-hidden>
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
        </svg>
        <span className="text-left leading-none">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
            Download on the
          </span>
          <span className="mt-1 block text-[16px] font-extrabold tracking-tight">
            App Store
          </span>
        </span>
      </Link>
      <Link
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener"
        className="group flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.03] px-5 py-3 transition hover:border-lime/50 hover:bg-white/[0.06]"
      >
        <svg viewBox="0 0 512 512" className="h-6 w-6 fill-white" aria-hidden>
          <path d="M325.3 234.3 104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
        </svg>
        <span className="text-left leading-none">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
            Get it on
          </span>
          <span className="mt-1 block text-[16px] font-extrabold tracking-tight">
            Google Play
          </span>
        </span>
      </Link>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-line bg-ink/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="FreeAgentsFC"
            width={34}
            height={34}
            className="rounded-[9px]"
            priority
          />
          <span className="text-[15px] font-extrabold tracking-tight">
            FreeAgentsFC
          </span>
        </Link>
        <div className="hidden items-center gap-8 text-[13.5px] font-semibold text-white/60 md:flex">
          <Link href="#proof" className="transition hover:text-white">
            The numbers
          </Link>
          <Link href="#sides" className="transition hover:text-white">
            How it works
          </Link>
          <Link href="#saying" className="transition hover:text-white">
            What people say
          </Link>
        </div>
        <Link
          href="#get"
          className="rounded-full bg-lime px-4.5 px-5 py-2 text-[13px] font-extrabold tracking-tight text-black transition hover:brightness-110"
        >
          Get the app
        </Link>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Floodlight wash + faint pitch markings (centre circle + halfway
          line) — the brand's geometry instead of a generic tech grid. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 20% -10%, rgba(198,248,6,0.14) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 95% 105%, rgba(34,84,44,0.45) 0%, transparent 60%)",
        }}
      />
      <svg
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-[1600px] -translate-x-1/2 opacity-[0.05]"
        viewBox="0 0 1600 900"
        fill="none"
      >
        <line x1="0" y1="450" x2="1600" y2="450" stroke="white" strokeWidth="2" />
        <circle cx="800" cy="450" r="260" stroke="white" strokeWidth="2" />
        <circle cx="800" cy="450" r="6" fill="white" />
      </svg>

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10 lg:pb-28 lg:pt-24">
        <div>
          <div className="rise" style={{ "--d": "0s" } as React.CSSProperties}>
            <RatingChip />
          </div>

          <h1
            className="rise mt-8 font-display text-[clamp(58px,9vw,118px)] uppercase leading-[0.88] tracking-tight"
            style={{ "--d": "0.08s" } as React.CSSProperties}
          >
            Get seen.
            <br />
            <span className="text-lime">Get signed.</span>
          </h1>

          <p
            className="rise mt-7 max-w-[34rem] text-pretty text-lg leading-relaxed text-white/65 md:text-xl"
            style={{ "--d": "0.18s" } as React.CSSProperties}
          >
            The UK football marketplace where free agents, coaches, clubs and
            scouts find each other — real profiles, real trials, real
            conversations that turn into contracts.
          </p>

          <div
            className="rise mt-9"
            id="get"
            style={{ "--d": "0.28s" } as React.CSSProperties}
          >
            <StoreBadges />
          </div>

          <p
            className="rise mt-7 text-[13px] font-semibold uppercase tracking-[0.16em] text-white/40"
            style={{ "--d": "0.36s" } as React.CSSProperties}
          >
            Free to join · No agents, no middlemen · UK-wide
          </p>
        </div>

        <div
          className="rise relative mx-auto"
          style={{ "--d": "0.2s" } as React.CSSProperties}
        >
          <PhoneMock />
        </div>
      </div>
    </section>
  );
}

/** The real app, running — a screen recording of the live walkthrough
 *  (Discover feed → Trials → Inbox → Profile) inside a titanium phone. */
function PhoneMock() {
  return (
    <div className="float-slow relative">
      <div
        aria-hidden
        className="absolute -inset-12 -z-10 rounded-full bg-lime/10 blur-3xl"
      />

      {/* Titanium body */}
      <div
        className="relative w-[290px] rounded-[52px] p-[10px] shadow-[0_50px_90px_-30px_rgba(0,0,0,0.85)] sm:w-[316px]"
        style={{
          background:
            "linear-gradient(140deg, #3a3a40 0%, #19191c 30%, #202024 62%, #46464c 100%)",
          boxShadow:
            "0 50px 90px -30px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Side hardware — action, volume up/down (left), power (right) */}
        <span
          aria-hidden
          className="absolute -left-[2.5px] top-[104px] h-[22px] w-[3px] rounded-l-md"
          style={{ background: "linear-gradient(90deg, #4a4a52, #222226)" }}
        />
        <span
          aria-hidden
          className="absolute -left-[2.5px] top-[152px] h-[44px] w-[3px] rounded-l-md"
          style={{ background: "linear-gradient(90deg, #4a4a52, #222226)" }}
        />
        <span
          aria-hidden
          className="absolute -left-[2.5px] top-[206px] h-[44px] w-[3px] rounded-l-md"
          style={{ background: "linear-gradient(90deg, #4a4a52, #222226)" }}
        />
        <span
          aria-hidden
          className="absolute -right-[2.5px] top-[170px] h-[64px] w-[3px] rounded-r-md"
          style={{ background: "linear-gradient(270deg, #4a4a52, #222226)" }}
        />

        {/* Screen — the app, actually running */}
        <div className="relative aspect-[540/1170] overflow-hidden rounded-[42px] bg-black ring-1 ring-black">
          <video
            src="/screen-loop.mp4"
            poster="/screen-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* glass glare */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(125deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.04) 100%)",
              mixBlendMode: "screen",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Live trials ticker ───────────────────────────────────────────────

function TrialsTicker() {
  const items = [...TICKER_TRIALS, ...TICKER_TRIALS]; // seamless loop
  return (
    <section
      aria-label="Trials live on the app right now"
      className="border-y border-line bg-[#0c0e11]"
    >
      <div className="flex items-stretch">
        <div className="z-10 flex shrink-0 items-center gap-2 border-r border-line bg-[#0c0e11] px-5 py-3.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
          </span>
          <span className="whitespace-nowrap text-[11px] font-extrabold uppercase tracking-[0.18em] text-lime">
            Live on the app
          </span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="ticker-track items-center py-3.5">
            {items.map((t, i) => (
              <span
                key={i}
                className="flex items-center whitespace-nowrap text-[13px] font-semibold text-white/70"
              >
                <span className="px-6">{t}</span>
                <span className="h-1 w-1 rounded-full bg-lime/70" />
              </span>
            ))}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0c0e11] to-transparent"
          />
        </div>
      </div>
    </section>
  );
}

// ─── Proof ────────────────────────────────────────────────────────────

function Proof() {
  return (
    <section id="proof" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <Reveal>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.24em] text-lime">
            One month since launch
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(40px,5.5vw,72px)] uppercase leading-[0.92]">
            The receipts, straight from the database
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-y-14 lg:grid-cols-[1.2fr_1fr] lg:gap-x-20">
          {/* Lead number — oversized, asymmetric */}
          <Reveal>
            <div>
              <Count
                to={PROOF.chatsThatLed}
                className="font-display text-[clamp(110px,17vw,240px)] leading-[0.85] text-lime"
              />
              <p className="mt-4 max-w-md text-pretty text-lg font-semibold leading-snug text-white/85">
                conversations that led to a real opportunity — a trial invite,
                a number exchanged, a signing.
              </p>
              <p className="mt-3 text-[12px] font-medium uppercase tracking-[0.16em] text-white/35">
                39% of every conversation on the platform
              </p>
            </div>
          </Reveal>

          {/* Supporting numbers — stacked ledger rows, not a card grid */}
          <div className="flex flex-col justify-center divide-y divide-white/[0.07]">
            <LedgerRow to={PROOF.members} label="players, coaches, clubs & scouts" delay={60} />
            <LedgerRow to={PROOF.connections} label="connections made" delay={120} />
            <LedgerRow to={PROOF.numbersSwapped} label="phone numbers exchanged" delay={180} />
            <LedgerRow
              to={PROOF.applications}
              label={`applications to ${PROOF.trials} trials`}
              delay={240}
            />
          </div>
        </div>

        <Reveal delay={150}>
          <p className="mt-16 text-[12px] font-medium text-white/30">
            Counted from the live production database, 11 June 2026. No
            projections, no &quot;up to&quot; — just what happened.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function LedgerRow({
  to,
  label,
  delay,
}: {
  to: number;
  label: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="flex items-baseline justify-between gap-6 py-5">
        <Count
          to={to}
          className="font-display text-[clamp(38px,4.5vw,56px)] leading-none text-white"
        />
        <span className="text-right text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">
          {label}
        </span>
      </div>
    </Reveal>
  );
}

// ─── Two sides ────────────────────────────────────────────────────────

function TwoSides() {
  return (
    <section id="sides" className="border-t border-line bg-[#0c0e11]">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <Reveal>
          <h2 className="font-display text-[clamp(40px,5.5vw,72px)] uppercase leading-[0.92]">
            Two sides. <span className="text-lime">One pitch.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-12">
          {/* Players */}
          <Reveal>
            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.24em] text-lime">
                For players
              </p>
              <ol className="mt-7 space-y-6">
                <Step n="01" title="Build a profile that does the talking">
                  Photos, highlights, real season stats. Verified through FA
                  Full-Time so recruiters trust what they see.
                </Step>
                <Step n="02" title="Get discovered or go hunting">
                  Recruiters scroll the Discover feed; you apply to live
                  trials near you in one tap.
                </Step>
                <Step n="03" title="Talk directly. No middlemen.">
                  DMs with the coach who actually picks the team — read
                  receipts and all.
                </Step>
              </ol>
              {/* real chat artifact */}
              <div className="mt-9 max-w-sm rounded-2xl border border-white/10 bg-card p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">
                  A real opening line on the app
                </p>
                <div className="mt-3 rounded-xl rounded-tl-[4px] bg-white/[0.06] px-3.5 py-2.5 text-[13.5px] leading-snug text-white/90">
                  Saw your highlights — keen to chat next week. Free Sat 2pm?
                </div>
                <div className="mt-2 flex justify-end">
                  <div className="rounded-xl rounded-br-[4px] bg-lime px-3.5 py-2.5 text-[13.5px] font-semibold leading-snug text-black">
                    Yeah, sounds good. See you Sat 2pm.
                  </div>
                </div>
                <p className="mt-1.5 text-right text-[10px] font-bold text-[#34b7f1]">
                  ✓✓ Seen
                </p>
              </div>
            </div>
          </Reveal>

          {/* Clubs & coaches */}
          <Reveal delay={120}>
            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.24em] text-lime">
                For clubs, coaches & scouts
              </p>
              <ol className="mt-7 space-y-6">
                <Step n="01" title="Post a trial in two minutes">
                  Date, ground, positions wanted. It lands in front of every
                  matching player in range — push notification included.
                </Step>
                <Step n="02" title="Applications, not chaos">
                  A proper applicant list with positions, stats and
                  highlights. Shortlist, message, decide.
                </Step>
                <Step n="03" title="Fill the squad — or the dugout">
                  Players, coaches, managers, physios and analysts are all on
                  here. Whole clubs get staffed through the app.
                </Step>
              </ol>
              {/* real trial card artifact */}
              <div className="mt-9 max-w-sm rounded-2xl bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#1c3a22] px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-[#4caf50]">
                    TRIAL
                  </span>
                  <span className="text-[11px] font-bold text-white/55">
                    In 4d
                  </span>
                </div>
                <p className="mt-3 text-[15px] font-extrabold leading-tight">
                  Sporting Bengal United — Step 5 Trials
                </p>
                <p className="mt-1 text-[12.5px] text-white/55">
                  Tue 16 Jun · 7pm · Stepney Green
                </p>
                <p className="mt-2.5 flex items-center gap-1.5 text-[12px] font-extrabold text-[#ffb020]">
                  🔥 15 already applied
                </p>
                <span className="mt-3 flex h-10 items-center justify-center rounded-full border border-[#4caf50] bg-[#4caf50]/15 text-[13px] font-extrabold text-[#4caf50]">
                  ✓ Applied
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-4">
      <span className="font-display text-[22px] leading-[1.4] text-white/25">
        {n}
      </span>
      <span>
        <span className="block text-[16px] font-extrabold tracking-tight text-white">
          {title}
        </span>
        <span className="mt-1 block max-w-[26rem] text-[14px] leading-relaxed text-white/55">
          {children}
        </span>
      </span>
    </li>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────

function Testimonials() {
  const lead = QUOTES[0];
  const rest = QUOTES.slice(1);
  return (
    <section id="saying" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <Reveal>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.24em] text-lime">
            What people are saying
          </p>
          <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Real people · Real results · Quoted verbatim
          </p>
        </Reveal>

        <Reveal delay={80}>
          <figure className="mt-12 max-w-4xl">
            <span
              aria-hidden
              className="block font-display text-[88px] leading-[0.4] text-lime"
            >
              &ldquo;
            </span>
            <blockquote className="mt-6 text-balance text-[clamp(26px,3.6vw,44px)] font-bold leading-[1.18] tracking-tight text-white">
              {lead.text}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 text-[13px] font-semibold">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-lime font-extrabold text-black">
                {lead.who[0]}
              </span>
              <span className="text-white">{lead.who}</span>
              <span className="uppercase tracking-[0.14em] text-lime">
                {lead.role}
              </span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-16 grid gap-10 border-t border-white/[0.07] pt-12 md:grid-cols-3">
          {rest.map((q, i) => (
            <Reveal key={q.text} delay={i * 100}>
              <figure>
                <blockquote className="text-[17px] font-semibold leading-snug text-white/85">
                  &ldquo;{q.text}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-[12px] font-bold uppercase tracking-[0.14em] text-white/40">
                  {q.who} · <span className="text-lime/80">{q.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Closer ───────────────────────────────────────────────────────────

function YourMove() {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 110%, rgba(198,248,6,0.13) 0%, transparent 60%)",
        }}
      />
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-28 text-center lg:py-40">
        <Reveal>
          <h2 className="font-display text-[clamp(72px,14vw,200px)] uppercase leading-[0.85]">
            Your <span className="text-lime">move.</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-white/60">
            742 conversations turned into real opportunities in month one. The
            trials are live. The scouts are scrolling.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-10 flex flex-col items-center gap-6">
            <StoreBadges className="justify-center" />
            <RatingChip />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between lg:px-10">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt=""
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="text-[14px] font-extrabold tracking-tight">
            FreeAgentsFC
          </span>
          <span className="ml-2 text-[12px] text-white/35">
            Opportunity · Performance · Future
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-[13px] font-semibold text-white/50">
          <Link href={TWITTER_URL} target="_blank" rel="noopener" className="transition hover:text-white">
            X / Twitter
          </Link>
          <Link href="/support.html" className="transition hover:text-white">
            Support
          </Link>
          <Link href="/privacy.html" className="transition hover:text-white">
            Privacy
          </Link>
          <Link href="/terms.html" className="transition hover:text-white">
            Terms
          </Link>
          <Link href="/delete-account" className="transition hover:text-white">
            Delete account
          </Link>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-[12px] text-white/30">
        © 2026 FreeAgentsFC Ltd · Made for UK football
      </div>
    </footer>
  );
}
