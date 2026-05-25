"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Where to record the click — public Cloud Function, CORS-enabled.
const RECORD_CLICK_URL =
  "https://europe-west2-talentbase-app.cloudfunctions.net/recordAffiliateClick";

// Store URLs. iOS app live; Android pending (closed testing now, prod
// listing in review).
const APP_STORE_URL =
  "https://apps.apple.com/gb/app/freeagentsfc/id6765511407";
const PLAY_STORE_BASE =
  "https://play.google.com/store/apps/details?id=com.freeagentsfc.app";

type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

/**
 * `/r/<code>` — the entry point for every affiliate share link.
 *
 * Fires off two things on mount:
 *  1. Records the click to Cloud Functions for the affiliate's
 *     dashboard funnel (clicks → signups → conversions).
 *  2. Sets a cookie + redirects to the right store with the code
 *     baked into the referrer parameter so Play Install Referrer
 *     (Android) and the iOS clipboard fallback can pick it up.
 *
 * Shows a "Continue manually" CTA + the code displayed prominently
 * as a belt-and-braces fallback for when auto-redirect is blocked
 * or attribution drops between web and the app.
 */
export default function ReferralLandingPage() {
  const params = useParams<{ code: string }>();
  const code = (params?.code || "").toString().toUpperCase();
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [recorded, setRecorded] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);

  useEffect(() => {
    const p = detectPlatform();
    setPlatform(p);

    // 1. Drop the cookie (30-day) so a same-browser visit to the
    //    public web app picks it up at signup if attribution drops.
    document.cookie = `fafc_ref=${code}; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Lax`;

    // 2. Fire-and-forget click record. Don't block the redirect on it.
    fetch(RECORD_CLICK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        source: typeof document !== "undefined" ? document.referrer : null,
        landingUrl: typeof window !== "undefined" ? window.location.href : null,
        platform: p,
      }),
    })
      .then(async (res) => {
        if (res.ok) {
          setRecorded(true);
        } else if (res.status === 404) {
          setInvalidCode(true);
        }
      })
      .catch(() => {
        /* offline / blocked — fail silently */
      });

    // 3. Auto-redirect after a short delay so the user sees we
    //    captured the code (and so the click POST has time to fly).
    const t = window.setTimeout(() => {
      if (invalidCode) return;
      if (p === "android") {
        // Play Install Referrer Library reads the `referrer` param
        // post-install. Encode the affiliate code so we can map it
        // back on first app launch.
        const ref = encodeURIComponent(`fafc_ref=${code}`);
        window.location.href = `${PLAY_STORE_BASE}&referrer=${ref}`;
      } else if (p === "ios") {
        // iOS has no install-referrer equivalent — we rely on the
        // clipboard fallback the app reads on first launch, plus
        // the cookie if the user opens the in-app webview.
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(code).catch(() => {});
        }
        window.location.href = APP_STORE_URL;
      }
      // desktop — leave them on this page with the store buttons
    }, 1500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (invalidCode) {
    return (
      <main className="min-h-screen bg-ink text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">
            That code isn&apos;t active
          </h1>
          <p className="mt-3 text-white/70">
            The referral link you followed isn&apos;t recognised. You can still
            download the app directly.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={APP_STORE_URL}
              className="rounded-lg bg-lime px-5 py-3 font-bold text-black"
            >
              Open App Store
            </a>
            <Link
              href="/"
              className="rounded-lg border border-line/60 px-5 py-3 font-bold text-white/80"
            >
              Back home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-12 text-center">
        {/* Brand wordmark */}
        <div className="mb-10 flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight">
            FreeAgents<span className="text-lime">FC</span>
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-extrabold tracking-tight leading-tight">
          You&apos;ve been invited.
        </h1>
        <p className="mt-3 text-white/70">
          Your invite is locked in. Get the app to get scouted, post trials,
          or connect with players + clubs across UK football.
        </p>

        {/* Code badge — visible fallback if auto-attribution fails */}
        <div className="mt-8 w-full rounded-2xl border border-lime/40 bg-[#1A1F0A] p-5">
          <div className="text-[11px] font-extrabold tracking-[0.2em] text-lime">
            YOUR INVITE CODE
          </div>
          <div className="mt-1 font-mono text-4xl font-extrabold tracking-[8px]">
            {code}
          </div>
          <p className="mt-3 text-xs text-white/55">
            We&apos;ve copied this to your clipboard. If the app doesn&apos;t
            auto-detect, paste it on the signup screen.
          </p>
        </div>

        {/* Manual store buttons */}
        <div className="mt-8 flex w-full flex-col gap-3">
          {platform === "android" ? (
            <a
              href={`${PLAY_STORE_BASE}&referrer=${encodeURIComponent(`fafc_ref=${code}`)}`}
              className="rounded-xl bg-lime py-4 font-extrabold text-black"
            >
              Get it on Google Play
            </a>
          ) : (
            <a
              href={APP_STORE_URL}
              className="rounded-xl bg-lime py-4 font-extrabold text-black"
            >
              Get it on the App Store
            </a>
          )}
          {/* The other store, in case detection was wrong */}
          {platform === "android" ? (
            <a
              href={APP_STORE_URL}
              className="rounded-xl border border-line/60 py-4 font-bold text-white/80"
            >
              I&apos;m on iPhone instead
            </a>
          ) : (
            <a
              href={`${PLAY_STORE_BASE}&referrer=${encodeURIComponent(`fafc_ref=${code}`)}`}
              className="rounded-xl border border-line/60 py-4 font-bold text-white/80"
            >
              I&apos;m on Android instead
            </a>
          )}
        </div>

        {/* Status pill */}
        <div className="mt-6 text-xs text-white/45">
          {recorded
            ? "Your visit has been credited to the inviter."
            : "Setting up your invite..."}
        </div>

        <div className="mt-12 text-xs text-white/40">
          <Link href="/" className="hover:text-white/70">
            ← FreeAgentsFC home
          </Link>
        </div>
      </div>
    </main>
  );
}
