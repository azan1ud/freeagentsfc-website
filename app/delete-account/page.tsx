import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete your account · FreeAgentsFC",
  description:
    "How to delete your FreeAgentsFC account and the data we keep / remove.",
};

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-ink text-white selection:bg-lime selection:text-black">
      <div className="mx-auto max-w-2xl px-6 py-16 lg:px-10 lg:py-24">
        <Link
          href="/"
          className="text-sm text-white/60 hover:text-white"
        >
          ← Back to FreeAgentsFC
        </Link>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight lg:text-4xl">
          Delete your account
        </h1>
        <p className="mt-3 text-white/70">
          You can remove your FreeAgentsFC account and your personal data at
          any time. There are two ways to do it.
        </p>

        <Section heading="Option 1 — From inside the app (fastest, ~30 seconds)">
          <ol className="list-decimal space-y-3 pl-5 marker:text-lime">
            <li>Open the FreeAgentsFC app and sign in.</li>
            <li>
              Tap your <span className="font-semibold">Profile</span> tab
              (bottom-right of the screen).
            </li>
            <li>
              Tap <span className="font-semibold">Settings</span> in the
              top-right of the profile screen.
            </li>
            <li>
              Scroll to the bottom and tap{" "}
              <span className="font-semibold text-red-400">
                Delete account
              </span>
              .
            </li>
            <li>
              Confirm the deletion. You&apos;ll be signed out immediately and
              your account will be permanently removed.
            </li>
          </ol>
        </Section>

        <Section heading="Option 2 — Email us">
          <p className="text-white/80">
            If you can&apos;t sign in or prefer to ask us to delete it for
            you, email{" "}
            <a
              href="mailto:support@freeagentsfc.com?subject=Delete%20my%20account"
              className="font-semibold text-lime hover:underline"
            >
              support@freeagentsfc.com
            </a>{" "}
            from the email address registered to your account, with the
            subject line <span className="font-mono">Delete my account</span>.
          </p>
          <p className="mt-3 text-white/70">
            We&apos;ll verify the request and delete your account within
            7 days, usually within 24 hours.
          </p>
        </Section>

        <Section heading="What gets deleted">
          <ul className="list-disc space-y-2 pl-5 text-white/80 marker:text-lime">
            <li>
              Your profile (name, photo, bio, location, role, position,
              level, stats, career history, social handles).
            </li>
            <li>Your photos and highlight clips.</li>
            <li>Your direct messages.</li>
            <li>Your connections and likes.</li>
            <li>Your trial-event posts and applications.</li>
            <li>Your push-notification tokens.</li>
            <li>Your sign-in credentials (Firebase Auth record).</li>
          </ul>
        </Section>

        <Section heading="What may be retained, and for how long">
          <ul className="list-disc space-y-2 pl-5 text-white/80 marker:text-lime">
            <li>
              <span className="font-semibold">Anonymised analytics</span>{" "}
              (e.g. &ldquo;a profile was viewed&rdquo; counters with no link
              back to you) — retained indefinitely for service health.
            </li>
            <li>
              <span className="font-semibold">Payment / subscription records</span>{" "}
              required by Apple, Google or tax authorities — retained for up
              to 7 years per UK accounting regulations. These records do not
              contain your personal profile content.
            </li>
            <li>
              <span className="font-semibold">Moderation reports</span>{" "}
              filed against your account — kept for trust-and-safety purposes
              for 12 months after deletion in case the same actor returns.
            </li>
          </ul>
        </Section>

        <Section heading="Timeframe">
          <p className="text-white/80">
            In-app deletion is{" "}
            <span className="font-semibold">immediate</span> — your account
            disappears the moment you confirm. Email-requested deletion is
            processed within <span className="font-semibold">7 days</span>.
            Anonymised analytics are not reversible.
          </p>
        </Section>

        <p className="mt-12 text-sm text-white/50">
          Questions? Email{" "}
          <a
            href="mailto:support@freeagentsfc.com"
            className="text-lime hover:underline"
          >
            support@freeagentsfc.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold tracking-tight">{heading}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
