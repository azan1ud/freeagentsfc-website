import Link from "next/link";

// Hosting URLs — swap once a new build lands. Keep these as constants so
// the rest of the page renders from a single source of truth.
const APK_URL =
  "https://firebasestorage.googleapis.com/v0/b/talentbase-app.firebasestorage.app/o/public%2Fapp-debug.apk?alt=media";
const APP_STORE_URL =
  "https://apps.apple.com/gb/app/freeagentsfc/id6765511407";
const TWITTER_URL = "https://x.com/FreeAgentsFC1";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink text-white selection:bg-lime selection:text-black">
      <Nav />
      <Hero />
      <Marquee />
      <Features />
      <HowItWorks />
      <Download />
      <Testimonials />
      <FeedbackGuide />
      <Footer />
    </main>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-line/60 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="text-[15px] font-extrabold tracking-tight">
            FreeAgentsFC
          </span>
        </Link>
        <div className="hidden items-center gap-7 text-sm font-semibold text-white/70 md:flex">
          <Link href="#features" className="hover:text-white">
            Features
          </Link>
          <Link href="#how" className="hover:text-white">
            How it works
          </Link>
          <Link href="#download" className="hover:text-white">
            Download
          </Link>
        </div>
        <Link
          href="#download"
          className="rounded-full bg-lime px-4 py-2 text-[13px] font-extrabold tracking-tight text-black transition hover:scale-[1.03]"
        >
          Get the app →
        </Link>
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <div className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-lime to-[#9fce04] text-black shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset]">
      <span className="text-[15px] font-black leading-none tracking-tighter">
        F
      </span>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Layered radial gradients — soft lime glow top-left, denser
          pitch-green bottom-right. Cheaper than an image, doesn't
          shift on resize. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 15% 0%, rgba(198,248,6,0.22) 0%, transparent 55%), radial-gradient(ellipse 70% 60% at 90% 100%, rgba(76,175,80,0.18) 0%, transparent 60%), linear-gradient(180deg, #0a0b0d 0%, #0a0b0d 100%)",
        }}
      />
      {/* Subtle grid — premium fintech look, suggests data without
          shouting. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "linear-gradient(180deg, black 0%, black 60%, transparent 100%)",
        }}
      />

      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20 lg:px-10 lg:py-32">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-lime">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" />
            Live · iOS &amp; Android
          </span>
          <h1 className="mt-7 text-balance text-[44px] font-black leading-[0.95] tracking-[-0.04em] sm:text-[56px] lg:text-[72px]">
            Where players
            <br />
            get{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-lime">scouted.</span>
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-1 h-3 -skew-x-[18deg] bg-lime/15"
              />
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-white/65 md:text-xl">
            One platform for free agents, coaches, recruiters and clubs.
            Build a profile that gets you found by the people who
            actually sign players.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="#download"
              className="group inline-flex items-center gap-2 rounded-2xl bg-lime px-6 py-4 text-[15px] font-black tracking-tight text-black shadow-[0_8px_30px_-8px_rgba(198,248,6,0.6)] transition hover:scale-[1.02] hover:shadow-[0_10px_40px_-8px_rgba(198,248,6,0.8)]"
            >
              Download the app
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-4 text-[15px] font-bold text-white transition hover:border-white/30 hover:bg-white/[0.07]"
            >
              <AppleGlyphMini />
              App Store
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-7 text-[13px] font-medium text-white/55">
            <Stat number="100" label="founding members" />
            <Divider />
            <Stat number="0£" label="to join · no paywall" />
            <Divider />
            <Stat number="UK" label="football pyramid" />
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-lg font-black tracking-tight text-white">
        {number}
      </div>
      <div className="text-xs uppercase tracking-widest">{label}</div>
    </div>
  );
}

function Divider() {
  return <span className="h-8 w-px bg-white/10" />;
}

/// Premium hero visual — instead of a fake phone mockup we float
/// three skewed cards in the same look as the app's player-detail
/// surfaces. Suggests app feel without faking screenshots, and
/// degrades gracefully on small screens.
function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-[3rem] bg-gradient-to-br from-lime/15 via-transparent to-transparent blur-2xl"
      />
      <div className="relative h-[540px]">
        {/* Back card — stat-heavy player */}
        <FloatingCard
          className="absolute right-0 top-0 w-[78%] rotate-[5deg]"
          tone="dim"
        >
          <CardHeader
            initials="MO"
            name="Marcus O."
            tag="CB · Step 3"
            verified
          />
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <KV k="APPS" v="28" />
            <KV k="GOALS" v="2" />
            <KV k="CLEAN" v="11" />
          </div>
          <div className="mt-5 flex flex-wrap gap-1.5">
            <Pill>Reads play</Pill>
            <Pill>Aerial</Pill>
          </div>
        </FloatingCard>

        {/* Mid card — connection / message */}
        <FloatingCard
          className="absolute left-0 top-[36%] w-[68%] -rotate-[4deg]"
          tone="lime"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-black/15 text-xs font-black text-black">
              JT
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-extrabold text-black">
                Coach Tomlin
              </div>
              <div className="text-[10px] font-semibold text-black/60">
                Step 4 · Hackney FC
              </div>
            </div>
          </div>
          <div className="mt-3 rounded-xl bg-black/10 px-3 py-2 text-[12px] leading-tight text-black/85">
            “Saw your reel — want to come down for a session
            Wednesday?”
          </div>
        </FloatingCard>

        {/* Front card — featured striker */}
        <FloatingCard
          className="absolute bottom-0 right-2 w-[80%] rotate-[-3deg] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
          tone="dark"
        >
          <div className="flex items-center justify-between">
            <CardHeader
              initials="AD"
              name="Ade D."
              tag="ST · Step 5"
              compact
            />
            <span className="rounded-full bg-lime/20 px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest text-lime">
              Founding #42
            </span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            <KV k="APPS" v="22" />
            <KV k="G" v="18" big />
            <KV k="A" v="9" />
            <KV k="G+A/90" v="1.4" />
          </div>
          <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white/70">
              10 MI · London
            </div>
            <div className="h-2 flex-1 rounded-full bg-white/5">
              <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-lime to-[#9fce04]" />
            </div>
          </div>
        </FloatingCard>
      </div>
    </div>
  );
}

function FloatingCard({
  children,
  className = "",
  tone = "dim",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "dim" | "dark" | "lime";
}) {
  const tones: Record<string, string> = {
    dim: "bg-card/90 border-white/8 backdrop-blur-xl",
    dark: "bg-[#0e1014]/95 border-white/10 backdrop-blur-xl",
    lime: "bg-lime border-lime",
  };
  return (
    <div
      className={`rounded-3xl border p-5 shadow-2xl ${tones[tone]} ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({
  initials,
  name,
  tag,
  verified,
  compact,
}: {
  initials: string;
  name: string;
  tag: string;
  verified?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`grid place-items-center rounded-full bg-gradient-to-br from-white/15 to-white/5 font-black text-white ${
          compact ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm"
        }`}
      >
        {initials}
      </div>
      <div>
        <div className="flex items-center gap-1.5 text-[13px] font-extrabold tracking-tight text-white">
          {name}
          {verified && (
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 fill-lime"
              aria-hidden
            >
              <path d="M12 2l2.39 4.84L20 7.27l-4 3.9.94 5.51L12 14.77 7.06 16.68 8 11.17l-4-3.9 5.61-.43L12 2z" />
            </svg>
          )}
        </div>
        <div className="text-[11px] font-semibold text-white/55">{tag}</div>
      </div>
    </div>
  );
}

function KV({ k, v, big }: { k: string; v: string; big?: boolean }) {
  return (
    <div className="rounded-lg bg-white/[0.04] px-2 py-2.5">
      <div
        className={`font-black tracking-tight ${
          big ? "text-2xl text-lime" : "text-base text-white"
        }`}
      >
        {v}
      </div>
      <div className="text-[9px] font-bold uppercase tracking-widest text-white/45">
        {k}
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white/75">
      {children}
    </span>
  );
}

function AppleGlyphMini() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.823.99-2.18 1.76-3.282 1.67-.144-1.04.444-2.18 1.105-2.93.792-.91 2.16-1.63 3.354-1.82zm4.43 16.36c-.65 1.42-.97 2.05-1.81 3.31-1.18 1.76-2.85 3.96-4.91 3.98-1.83.02-2.3-1.19-4.78-1.18-2.48.01-2.99 1.2-4.82 1.19-2.06-.02-3.64-2.01-4.82-3.77C-.27 17.21-.18 13.4 1.55 11.6c1.22-1.27 2.81-2.01 4.42-2.04 2.07-.03 4.02 1.39 5.27 1.39 1.25 0 3.55-1.71 5.99-1.46.98.04 3.71.4 5.46 2.99-.14.09-3.28 1.91-3.24 5.71.04 4.55 4.0 6.07 4.04 6.09-.03.1-.64 2.21-2.13 4.39z" />
    </svg>
  );
}

// ─── Marquee bar ──────────────────────────────────────────────────────

function Marquee() {
  const items = [
    "Premier League",
    "Championship",
    "League One",
    "League Two",
    "National League",
    "Step 3",
    "Step 4",
    "Step 5",
    "Step 6",
    "WSL",
    "Women's Championship",
    "FA WNL",
    "Academy",
  ];
  return (
    <section className="border-y border-line/60 bg-white/[0.015]">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-6 lg:px-10">
        <div className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.24em] text-white/40">
          Covering the full pyramid
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-extrabold tracking-tight text-white/45">
          {items.map((it) => (
            <span key={it}>{it}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────

function Features() {
  return (
    <section id="features" className="border-b border-line/60">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <SectionHeader
          eyebrow="The platform"
          title="Built for grassroots scouting."
          subtitle="No CVs in DMs. No “check my Instagram”. One profile, all the people who matter — and tools to actually find each other."
        />
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Profiles that pass the eye-test"
            body="Highlight reels, season stats, position, travel radius, season-by-season career history. Built for the format scouts actually look at."
            icon="profile"
          />
          <FeatureCard
            title="Discover that works"
            body="Filter by level, position, gender, location radius — and rank by who actually plays the role you need. Not endless infinite scroll."
            icon="search"
          />
          <FeatureCard
            title="DMs that don't get lost"
            body="Cold messages land in Requests until accepted. Connections show in Inbox. Nothing gets buried."
            icon="message"
          />
          <FeatureCard
            title="Verification you can trust"
            body="ID + FA Full-Time roster checks for tiered verified badges. Players can prove the stats are theirs. Coaches can prove the club is theirs."
            icon="shield"
          />
          <FeatureCard
            title="Built for clubs &amp; coaches"
            body="Scouts, recruiters, agents and clubs all get role-specific profiles. Post who you are and what you're looking for."
            icon="club"
          />
          <FeatureCard
            title="Free to join. No paywall."
            body="First 100 get founding-member status on their profile permanently. Pro features later are opt-in — discovery stays free."
            icon="badge"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-line/80 bg-card/40 p-7 transition hover:border-lime/30 hover:bg-card/80">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-lime/0 blur-3xl transition group-hover:bg-lime/[0.07]"
      />
      <FeatureIcon name={icon} />
      <h3 className="mt-6 text-xl font-extrabold tracking-tight text-white">
        {title}
      </h3>
      <p
        className="mt-3 text-[14.5px] leading-relaxed text-white/60"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  );
}

function FeatureIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    profile: (
      <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2c-3.3 0-9.9 1.6-9.9 4.9V22h19.8v-3.1c0-3.3-6.6-4.9-9.9-4.9z" />
    ),
    search: (
      <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 5L20.49 19l-4.99-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
    ),
    message: (
      <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" />
    ),
    shield: (
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
    ),
    club: (
      <path d="M12 6c1.66 0 3-1.34 3-3S13.66 0 12 0 9 1.34 9 3s1.34 3 3 3zM5.5 8h13c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5H17v6h-2v-6h-2v6h-2v-6H9v6H7v-6H5.5C4.67 17 4 16.33 4 15.5v-6C4 8.67 4.67 8 5.5 8z" />
    ),
    badge: (
      <path d="M12 2l2.39 4.84L20 7.27l-4 3.9.94 5.51L12 14.77 7.06 16.68 8 11.17l-4-3.9 5.61-.43L12 2z" />
    ),
  };
  return (
    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-lime/20 bg-lime/10 text-lime">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
        {paths[name]}
      </svg>
    </div>
  );
}

// ─── How it works ─────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Sign up. Pick your role.",
      body: "Player, coach, recruiter, club, fan, or services. Each role gets a profile shape that fits how scouting actually works.",
    },
    {
      n: "02",
      title: "Build the profile in 5 minutes.",
      body: "Position, level, stats, highlights, photos, travel radius. We pre-fill what we can; you fine-tune.",
    },
    {
      n: "03",
      title: "Get found. Get in the room.",
      body: "Coaches and recruiters filter exactly to what they need. When they message, you're in the conversation that matters.",
    },
  ];
  return (
    <section id="how" className="border-b border-line/60 bg-white/[0.015]">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <SectionHeader
          eyebrow="How it works"
          title="From signup to first message in under a week."
          subtitle="Every grassroots player has been told to “put your stats on Twitter” — we built the thing that actually does it."
        />
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative rounded-3xl border border-line/80 bg-card/40 p-8"
            >
              <div className="font-mono text-sm font-bold tracking-widest text-lime">
                {s.n}
              </div>
              <h3 className="mt-4 text-xl font-extrabold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/60">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-lime">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-balance text-4xl font-black tracking-[-0.03em] md:text-5xl">
        {title}
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-white/60">
        {subtitle}
      </p>
    </div>
  );
}

// ─── Download ─────────────────────────────────────────────────────────

function Download() {
  return (
    <section id="download" className="relative overflow-hidden border-b border-line/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(198,248,6,0.10) 0%, transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <SectionHeader
          eyebrow="Install"
          title="Get the app."
          subtitle="iPhone users grab it from the App Store. Android users sideload directly while we finish the Play Store listing."
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          {/* iOS */}
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener"
            className="group relative overflow-hidden rounded-3xl border border-line/80 bg-card/40 p-9 transition hover:border-white/30 hover:bg-card/70"
          >
            <div className="flex items-center justify-between">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-white">
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7 fill-current"
                  aria-hidden
                >
                  <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.823.99-2.18 1.76-3.282 1.67-.144-1.04.444-2.18 1.105-2.93.792-.91 2.16-1.63 3.354-1.82zm4.43 16.36c-.65 1.42-.97 2.05-1.81 3.31-1.18 1.76-2.85 3.96-4.91 3.98-1.83.02-2.3-1.19-4.78-1.18-2.48.01-2.99 1.2-4.82 1.19-2.06-.02-3.64-2.01-4.82-3.77C-.27 17.21-.18 13.4 1.55 11.6c1.22-1.27 2.81-2.01 4.42-2.04 2.07-.03 4.02 1.39 5.27 1.39 1.25 0 3.55-1.71 5.99-1.46.98.04 3.71.4 5.46 2.99-.14.09-3.28 1.91-3.24 5.71.04 4.55 4.0 6.07 4.04 6.09-.03.1-.64 2.21-2.13 4.39z" />
                </svg>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white/55">
                Live
              </span>
            </div>
            <h3 className="mt-7 text-3xl font-black tracking-[-0.02em]">
              iPhone
            </h3>
            <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-white/60">
              Open the App Store and tap install. Auto-updates handled by
              Apple — no extra setup.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold tracking-tight text-white transition group-hover:text-lime">
              Open App Store
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </a>

          {/* Android — the urgent v1 path */}
          <a
            href={APK_URL}
            className="group relative overflow-hidden rounded-3xl border border-lime/40 bg-lime/[0.06] p-9 transition hover:border-lime"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lime/20 blur-3xl"
            />
            <div className="relative flex items-center justify-between">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-lime/20 text-lime">
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7 fill-current"
                  aria-hidden
                >
                  <path d="M17.523 15.341a1.001 1.001 0 110-2.002 1.001 1.001 0 010 2.002m-11.046 0a1.001 1.001 0 110-2.002 1.001 1.001 0 010 2.002m11.405-6.18l1.998-3.46a.415.415 0 00-.152-.567.415.415 0 00-.568.152l-2.022 3.505A12.46 12.46 0 0012 7.875c-1.86 0-3.63.42-5.21 1.158L4.77 5.527a.415.415 0 00-.568-.152.415.415 0 00-.152.567l1.998 3.46C2.65 11.083.5 14.337.5 18.005h23c0-3.668-2.15-6.92-5.618-8.844" />
                </svg>
              </div>
              <span className="rounded-full bg-lime px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-black">
                Early access
              </span>
            </div>
            <h3 className="relative mt-7 text-3xl font-black tracking-[-0.02em]">
              Android
            </h3>
            <p className="relative mt-3 max-w-md text-[14.5px] leading-relaxed text-white/65">
              Direct APK download while we finish the Play Store listing.
              In-app update prompts when a new version ships — install once,
              we'll handle the rest.
            </p>
            <div className="relative mt-8 inline-flex items-center gap-2 text-sm font-extrabold tracking-tight text-lime">
              Download APK
              <span className="transition-transform group-hover:translate-x-1">
                ↓
              </span>
            </div>
          </a>
        </div>

        {/* Sideload guide */}
        <div className="mt-10 rounded-3xl border border-line/80 bg-card/40 p-8 lg:p-10">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="text-2xl font-black tracking-[-0.02em]">
              Installing on Android in 4 steps
            </h3>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
              Sideload guide
            </span>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Step n="1" title="Download">
              Tap{" "}
              <span className="font-bold text-lime">Download APK</span>{" "}
              above. Save the file to your phone.
            </Step>
            <Step n="2" title="Open">
              Open your <span className="font-bold">Downloads</span> folder
              and tap the FreeAgentsFC APK.
            </Step>
            <Step n="3" title="Allow">
              Your phone asks to allow installs from this source — tap{" "}
              <span className="font-bold text-lime">Settings → Allow</span>
              , then return.
            </Step>
            <Step n="4" title="Install">
              Tap <span className="font-bold">Install</span>. Open the app
              and sign up — first 100 are founding members.
            </Step>
          </div>
          <p className="mt-8 text-xs text-white/35">
            The APK is signed and safe. The “unknown developer” warning is
            only because we&apos;re bypassing the Play Store while the
            listing is in review.
          </p>
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
    <div className="relative rounded-2xl border border-line/60 bg-ink/40 p-6">
      <div className="font-mono text-xs font-bold tracking-widest text-lime">
        STEP {n}
      </div>
      <div className="mt-2 text-base font-extrabold tracking-tight text-white">
        {title}
      </div>
      <div className="mt-3 text-[13.5px] leading-relaxed text-white/65">
        {children}
      </div>
    </div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────

function Testimonials() {
  const items = [
    {
      quote:
        "Built my profile in 5 minutes. Got my first message from a Step 3 manager the same week.",
      name: "Ade",
      role: "Striker · Step 5",
      initials: "AD",
    },
    {
      quote:
        "Finally somewhere that isn't just Twitter DMs. The travel-radius filter alone is worth it.",
      name: "Marcus",
      role: "CB · Step 3",
      initials: "MO",
    },
    {
      quote:
        "We use it to scout for our reserve squad. Way faster than scrolling through a Telegram group.",
      name: "Jordan",
      role: "Coach · Step 4",
      initials: "JT",
    },
  ];
  return (
    <section className="border-b border-line/60">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <SectionHeader
          eyebrow="From the pitch"
          title="Players are getting found."
          subtitle="Honest words from the players, coaches and clubs using FreeAgentsFC right now."
        />
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t.name}
              className="relative flex flex-col rounded-3xl border border-line/80 bg-card/40 p-8 transition hover:border-white/20 hover:bg-card/70"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 fill-lime/40"
                aria-hidden
              >
                <path d="M9.13 7.34c-.46.85-.84 1.84-1.13 2.96-.29 1.12-.43 2.33-.43 3.62v3.74h4.83V13H10c0-1.07.2-2.04.6-2.92.4-.87.95-1.57 1.66-2.09.71-.52 1.45-.86 2.22-1.04l.43-3.06c-.7.1-1.43.32-2.18.66-.74.34-1.45.83-2.14 1.47-.69.64-1.16 1.35-1.46 2.32zm9 0c-.46.85-.84 1.84-1.13 2.96-.29 1.12-.43 2.33-.43 3.62v3.74h4.83V13H19c0-1.07.2-2.04.6-2.92.4-.87.95-1.57 1.66-2.09.71-.52 1.45-.86 2.22-1.04l.43-3.06c-.7.1-1.43.32-2.18.66-.74.34-1.45.83-2.14 1.47-.69.64-1.16 1.35-1.46 2.32z" />
              </svg>
              <blockquote className="mt-6 flex-1 text-balance text-lg leading-relaxed text-white/85">
                {t.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-white/15 to-white/5 text-xs font-black text-white">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white">
                    {t.name}
                  </div>
                  <div className="text-xs text-white/50">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-white/30">
          Quotes shown for launch — real testimonials added as they come in.
        </p>
      </div>
    </section>
  );
}

// ─── Feedback ─────────────────────────────────────────────────────────

function FeedbackGuide() {
  return (
    <section className="border-b border-line/60">
      <div className="mx-auto max-w-4xl px-6 py-28 lg:px-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-line/80 bg-gradient-to-br from-card/80 via-card/40 to-card/80 p-10 lg:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime/10 blur-3xl"
          />
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-lime">
            Found a bug?
          </span>
          <h2 className="mt-4 text-balance text-3xl font-black tracking-[-0.03em] md:text-4xl">
            Tell us. We read every message.
          </h2>
          <p className="mt-5 max-w-2xl text-balance text-lg leading-relaxed text-white/60">
            The fastest way to flag a bug, request a feature, or ask for
            help is straight from the app.
          </p>
          <div className="mt-8 inline-block rounded-2xl border border-line/80 bg-ink/60 p-6 text-left text-sm">
            <ol className="space-y-2.5">
              <li className="flex gap-3">
                <span className="text-lime">01</span> Open FreeAgentsFC
              </li>
              <li className="flex gap-3">
                <span className="text-lime">02</span>
                <span>
                  Go to{" "}
                  <span className="font-bold text-white">
                    Profile → Settings
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-lime">03</span>
                <span>
                  Tap{" "}
                  <span className="font-bold text-white">Send feedback</span>
                </span>
              </li>
            </ol>
          </div>
          <p className="mt-6 text-xs text-white/40">
            Or DM us on{" "}
            <Link
              href={TWITTER_URL}
              target="_blank"
              rel="noopener"
              className="font-bold text-lime hover:underline"
            >
              @FreeAgentsFC1
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-14 lg:flex-row lg:items-center lg:px-10">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <div className="text-sm font-extrabold tracking-tight text-white">
              FreeAgentsFC
            </div>
            <div className="text-[11px] text-white/40">
              © {new Date().getFullYear()} Keplo Ltd. All rights reserved.
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-7 text-sm font-semibold text-white/55">
          <Link
            href={TWITTER_URL}
            target="_blank"
            rel="noopener"
            className="hover:text-white"
          >
            Twitter / X
          </Link>
          <Link
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener"
            className="hover:text-white"
          >
            App Store
          </Link>
          <Link href="#download" className="hover:text-white">
            Android APK
          </Link>
          <a href="mailto:keploltd@gmail.com" className="hover:text-white">
            keploltd@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
