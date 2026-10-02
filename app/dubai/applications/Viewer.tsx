"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  Timestamp,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { fb } from "./firebaseClient";

const POSITIONS = ["GK", "RB", "CB", "LB", "DM", "CM", "AM", "RW", "LW", "ST"];
const REGIONS = ["UK", "Europe", "UAE", "Other Middle East", "Other"];
const SEEN_KEY = "fafc-dubai-apps-last-seen";

type App = {
  id: string;
  name: string;
  whatsapp: string;
  handle: string;
  region: string;
  age: string;
  positions: string[];
  level: string;
  status: string;
  highlights: string;
  passport: string;
  passportCountry: string;
  transfermarkt: string;
  payFee: string;
  ref: string;
  notes: string;
  submittedAt: Date | null;
  earlier: [string, string][]; // answers from the first version of the form
  isTest: boolean;
};

const str = (v: unknown) =>
  typeof v === "string" ? v.trim() : v == null ? "" : String(v);

// Until the rules update on 2 Oct, the API wrote these three answers into
// `notes` as one line. Read them back out so every application looks the same.
const NOTES_RE =
  /Passport: ([^|]*?)(?: \(([^)]*)\))? \| Transfermarkt: ([^|]*?) \| Willing to pay the fee: (.*)$/;

function toApp(id: string, d: Record<string, unknown>): App {
  const notes = str(d.notes);
  const m = notes.match(NOTES_RE);
  const fromNotes = (i: number) =>
    m ? (m[i] ?? "").trim().replace(/^-$/, "") : "";
  const earlier: [string, string][] = [];
  for (const [k, label] of [
    ["priceShown", "Price shown"],
    ["wouldBook", "Would book"],
    ["deposit", "Deposit"],
    ["dates", "Dates"],
  ] as const) {
    if (str(d[k])) earlier.push([label, str(d[k])]);
  }
  const name = str(d.name);
  const ts = d.submittedAt;
  return {
    id,
    name,
    whatsapp: str(d.whatsapp),
    handle: str(d.handle),
    region: str(d.region),
    age: str(d.age),
    positions: str(d.positions)
      .split(/[,/]+/)
      .map((p) => p.trim())
      .filter(Boolean),
    level: str(d.level),
    status: str(d.status),
    highlights: str(d.highlights),
    passport: str(d.passport) || fromNotes(1),
    passportCountry: str(d.passportCountry) || fromNotes(2),
    transfermarkt: str(d.transfermarkt) || fromNotes(3),
    payFee: str(d.payFee) || fromNotes(4),
    ref: str(d.ref),
    notes: m ? "" : notes,
    submittedAt: ts instanceof Timestamp ? ts.toDate() : null,
    earlier,
    isTest: /^test\b/i.test(name),
  };
}

// ---------- links ----------
function waLink(num: string, region: string) {
  let d = num.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  else if (d.startsWith("0") && region === "UK") d = "44" + d.slice(1);
  return d.length >= 8 ? `https://wa.me/${d}` : "";
}

// Only ever http(s): anything else an applicant typed becomes a harmless https URL.
function webLink(v: string) {
  const t = v.trim();
  if (!t || /^no$/i.test(t)) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

function handleLinks(h: string) {
  const t = h.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t) || /\.(com|net|co)\//i.test(t))
    return { main: webLink(t), x: "" };
  const u = encodeURIComponent(t.replace(/^@/, "").split(/\s/)[0]);
  return { main: `https://instagram.com/${u}`, x: `https://x.com/${u}` };
}

// ---------- time ----------
const fmtDay = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
const fmtTime = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });
function when(d: Date | null, now: number) {
  if (!d) return "";
  const mins = Math.round((now - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 60 * 10) return `${Math.round(mins / 60)} h ago`;
  return `${fmtDay.format(d)}, ${fmtTime.format(d)}`;
}

// ---------- CSV ----------
function toCsv(rows: App[]) {
  const head = [
    "Submitted", "Name", "WhatsApp", "Instagram or X", "Based", "Age", "Positions",
    "Level", "Status", "Highlights", "Passport", "Passport country",
    "Transfermarkt", "Willing to pay", "Source", "Notes",
  ];
  // Quote everything; a leading = + - @ would run as a formula in Excel/Sheets.
  const cell = (v: string) => {
    const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const lines = rows.map((a) =>
    [
      a.submittedAt ? `${fmtDay.format(a.submittedAt)} ${fmtTime.format(a.submittedAt)}` : "",
      a.name, a.whatsapp, a.handle, a.region, a.age, a.positions.join(", "),
      a.level, a.status, a.highlights, a.passport, a.passportCountry,
      a.transfermarkt, a.payFee, a.ref,
      [a.notes, ...a.earlier.map(([k, v]) => `${k}: ${v}`)].filter(Boolean).join(" | "),
    ]
      .map(cell)
      .join(","),
  );
  return "﻿" + [head.map(cell).join(","), ...lines].join("\r\n");
}

function downloadCsv(rows: App[]) {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `dubai-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// ---------- auth messages ----------
function authMessage(code: string) {
  switch (code) {
    case "auth/unauthorized-domain":
      return "Google sign-in isn't switched on for this website yet. In the Firebase console go to Authentication → Settings → Authorized domains and add freeagentsfc.com and www.freeagentsfc.com. Email and password sign-in already works.";
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in pop-up. Allow pop-ups for this site and try again.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "That email and password didn't work.";
    case "auth/too-many-requests":
      return "Too many tries. Wait a minute, then try again.";
    case "auth/network-request-failed":
      return "No connection. Check your internet and try again.";
    default:
      return `Sign-in failed (${code || "unknown error"}).`;
  }
}

// ---------- page ----------
export default function Viewer() {
  const [sample, setSample] = useState(false);
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [apps, setApps] = useState<App[] | null>(null);
  const [denied, setDenied] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [seenBefore, setSeenBefore] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // Local preview only: /dubai/applications?sample=1 shows made-up rows.
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).has("sample")) {
      setSample(true);
      setApps(sampleRows().map((d, i) => toApp(`sample-${i}`, d)));
      setSeenBefore(Date.now() - 3 * 3600_000);
      return;
    }
    return onAuthStateChanged(fb().auth, setUser);
  }, []);

  // "New since your last visit": remember when this browser last opened the page.
  useEffect(() => {
    if (sample || !user) return;
    let prev: number | null = null;
    try {
      const v = window.localStorage.getItem(SEEN_KEY);
      prev = v ? Number(v) : null;
      window.localStorage.setItem(SEEN_KEY, String(Date.now()));
    } catch {
      prev = null;
    }
    setSeenBefore(prev);
  }, [sample, user]);

  // Live list: new applications appear without a refresh.
  useEffect(() => {
    if (sample || !user) return;
    setDenied(false);
    setLoadError("");
    const q = query(collection(fb().db, "dubaiApplications"), orderBy("submittedAt", "desc"));
    return onSnapshot(
      q,
      (snap) => setApps(snap.docs.map((d) => toApp(d.id, d.data()))),
      (err) => {
        if (err.code === "permission-denied") setDenied(true);
        else setLoadError(err.message);
      },
    );
  }, [sample, user]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  if (!sample && user === undefined) return <Shell><p className="text-white/50">Loading…</p></Shell>;
  if (!sample && !user) return <SignIn />;
  if (denied)
    return (
      <Shell>
        <div className="mx-auto mt-16 max-w-md rounded-3xl border border-line bg-card p-8 text-center">
          <p className="font-display text-3xl uppercase text-lime">No access</p>
          <p className="mt-4 text-white/70">
            You&apos;re signed in as <span className="font-semibold text-white">{user?.email}</span>,
            but this account isn&apos;t on the FreeAgentsFC admin list.
          </p>
          <button onClick={() => signOut(fb().auth)} className="mt-6 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:border-white/40">
            Use another account
          </button>
        </div>
      </Shell>
    );

  return (
    <Shell
      right={
        <div className="flex items-center gap-3 text-xs text-white/50">
          <span className="hidden sm:inline">{sample ? "Sample data (local preview)" : user?.email}</span>
          {!sample && (
            <button onClick={() => signOut(fb().auth)} className="rounded-full border border-white/15 px-3 py-1.5 font-semibold text-white/70 hover:border-white/40">
              Sign out
            </button>
          )}
        </div>
      }
    >
      {loadError && <p className="mb-6 rounded-xl bg-red-500/10 p-4 text-sm text-red-300">Couldn&apos;t load: {loadError}</p>}
      {apps === null ? <p className="text-white/50">Loading applications…</p> : <Dashboard apps={apps} seenBefore={seenBefore} now={now} />}
    </Shell>
  );
}

function Shell({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-ink text-white">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="FreeAgentsFC" width={30} height={30} className="rounded-lg" priority />
            <span className="text-sm font-semibold text-white/80">FreeAgentsFC · Admin</span>
          </div>
          {right}
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}

function SignIn() {
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function google() {
    setErr("");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      await signInWithPopup(fb().auth, provider);
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") setErr(code);
    }
  }

  async function withEmail(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(fb().auth, email.trim(), password);
    } catch (e2) {
      setErr((e2 as { code?: string }).code ?? "");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <div className="mx-auto mt-10 max-w-md rounded-3xl border border-line bg-card p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime">Dubai · Free Agent Showcase</p>
        <h1 className="mt-3 font-display text-5xl uppercase leading-none">Applications</h1>
        <p className="mt-4 text-sm text-white/60">For the FreeAgentsFC team. Sign in with your admin account.</p>
        <button onClick={google} className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-white px-5 py-3.5 font-semibold text-ink hover:bg-white/90">
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.2l7.8 6.1C12.3 13.6 17.7 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
            <path fill="#FBBC05" d="M10.4 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.8-6.1z" />
            <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.7-4.1-13.6-9.8l-7.8 6.1C6.6 42.6 14.6 48 24 48z" />
          </svg>
          Sign in with Google
        </button>
        {!showEmail ? (
          <button onClick={() => setShowEmail(true)} className="mt-4 w-full text-center text-sm text-white/50 underline-offset-4 hover:text-white/80 hover:underline">
            Use email and password instead
          </button>
        ) : (
          <form onSubmit={withEmail} className="mt-6 space-y-3">
            <input type="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-white placeholder:text-white/30 focus:border-lime/60 focus:outline-none" />
            <input type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-white placeholder:text-white/30 focus:border-lime/60 focus:outline-none" />
            <button type="submit" disabled={busy || !email || !password} className="w-full rounded-full bg-lime px-5 py-3.5 font-bold text-ink disabled:opacity-40">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        )}
        {err && <p className="mt-5 rounded-xl bg-red-500/10 p-4 text-sm leading-relaxed text-red-300">{authMessage(err)}</p>}
      </div>
    </Shell>
  );
}

// ---------- dashboard ----------
type Fee = "" | "Yes" | "Maybe" | "No";

function Dashboard({ apps, seenBefore, now }: { apps: App[]; seenBefore: number | null; now: number }) {
  const [q, setQ] = useState("");
  const [fee, setFee] = useState<Fee>("");
  const [passport, setPassport] = useState<"" | "Yes" | "No">("");
  const [pos, setPos] = useState<string[]>([]);
  const [region, setRegion] = useState("");
  const [onlyHighlights, setOnlyHighlights] = useState(false);
  const [onlyTm, setOnlyTm] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const [sort, setSort] = useState<"new" | "old" | "age">("new");

  const real = useMemo(() => apps.filter((a) => !a.isTest), [apps]);
  const tests = apps.length - real.length;

  const stats = useMemo(() => {
    const day = new Date(now);
    day.setHours(0, 0, 0, 0);
    const since = (t: number) => real.filter((a) => a.submittedAt && a.submittedAt.getTime() >= t).length;
    const count = (k: "payFee" | "passport", v: string) => real.filter((a) => a[k] === v).length;
    return {
      today: since(day.getTime()),
      week: since(now - 7 * 86400_000),
      fee: { Yes: count("payFee", "Yes"), Maybe: count("payFee", "Maybe"), No: count("payFee", "No") },
      passport: { Yes: count("passport", "Yes"), No: count("passport", "No") },
      positions: POSITIONS.map((p) => [p, real.filter((a) => a.positions.includes(p)).length] as const),
    };
  }, [real, now]);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = (showTests ? apps : real).filter((a) => {
      if (fee && a.payFee !== fee) return false;
      if (passport && a.passport !== passport) return false;
      if (pos.length && !pos.some((p) => a.positions.includes(p))) return false;
      if (region && a.region !== region) return false;
      if (onlyHighlights && !webLink(a.highlights)) return false;
      if (onlyTm && !webLink(a.transfermarkt)) return false;
      if (needle) {
        const hay = [a.name, a.handle, a.region, a.level, a.status, a.passportCountry, a.whatsapp, a.ref].join(" ").toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    const t = (a: App) => a.submittedAt?.getTime() ?? 0;
    if (sort === "old") out.sort((a, b) => t(a) - t(b));
    else if (sort === "age") out.sort((a, b) => (Number(a.age) || 99) - (Number(b.age) || 99));
    else out.sort((a, b) => t(b) - t(a));
    return out;
  }, [apps, real, showTests, fee, passport, pos, region, onlyHighlights, onlyTm, q, sort]);

  const newCount = seenBefore === null ? 0 : real.filter((a) => (a.submittedAt?.getTime() ?? 0) > seenBefore).length;
  const filtered = Boolean(fee || passport || pos.length || region || onlyHighlights || onlyTm || q);
  const maxPos = Math.max(1, ...stats.positions.map(([, n]) => n));

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-lime">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
            </span>
            Live · Dubai showcase
          </p>
          <h1 className="mt-2 font-display text-5xl uppercase leading-none sm:text-6xl">Applications</h1>
        </div>
        {newCount > 0 && (
          <p className="rounded-full bg-lime px-4 py-2 text-sm font-extrabold text-ink">
            {newCount} new since your last visit
          </p>
        )}
      </header>

      {/* stats */}
      <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Applications" value={real.length} sub={`${stats.today} today · ${stats.week} this week`} />
        <div className="rounded-2xl border border-line bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-white/50">Willing to pay</p>
          <SplitBar parts={[
            ["Yes", stats.fee.Yes, "bg-lime"],
            ["Maybe", stats.fee.Maybe, "bg-amber-400"],
            ["No", stats.fee.No, "bg-white/25"],
          ]} />
        </div>
        <div className="col-span-2 rounded-2xl border border-line bg-card p-5 lg:col-span-1">
          <p className="text-xs font-bold uppercase tracking-wider text-white/50">Passport</p>
          <SplitBar parts={[
            ["Yes", stats.passport.Yes, "bg-lime"],
            ["No", stats.passport.No, "bg-red-400/70"],
          ]} />
        </div>
        <div className="col-span-2 rounded-2xl border border-line bg-card p-5 lg:col-span-1">
          <p className="text-xs font-bold uppercase tracking-wider text-white/50">Positions</p>
          <div className="mt-3 flex h-16 items-end gap-1.5">
            {stats.positions.map(([p, n]) => (
              <div key={p} className="flex flex-1 flex-col items-center gap-1" title={`${p}: ${n}`}>
                <span className="text-[10px] font-bold text-white/60">{n || ""}</span>
                <div className="w-full rounded-sm bg-lime/80" style={{ height: `${Math.max(2, (n / maxPos) * 40)}px`, opacity: n ? 1 : 0.2 }} />
                <span className="text-[9px] font-bold text-white/40">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* filters */}
      {/* sticky on desktop only: on a phone it would cover half the screen */}
      <section className="z-10 -mx-4 mt-8 border-b border-line bg-ink/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 md:sticky md:top-0">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, handle, club, country…"
            className="min-w-0 flex-1 basis-60 rounded-full border border-white/10 bg-card px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-lime/60 focus:outline-none"
          />
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="rounded-full border border-white/10 bg-card px-3 py-2.5 text-sm text-white">
            <option value="new">Newest first</option>
            <option value="old">Oldest first</option>
            <option value="age">Youngest first</option>
          </select>
          <button onClick={() => downloadCsv(rows)} className="rounded-full bg-lime px-4 py-2.5 text-sm font-bold text-ink hover:bg-lime/90">
            Export CSV
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Seg label="Pay" value={fee} options={["Yes", "Maybe", "No"]} onChange={(v) => setFee(v as Fee)} />
          <Seg label="Passport" value={passport} options={["Yes", "No"]} onChange={(v) => setPassport(v as "" | "Yes" | "No")} />
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="rounded-full border border-white/10 bg-card px-3 py-1.5 text-xs font-semibold text-white">
            <option value="">Anywhere</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <Toggle on={onlyHighlights} onClick={() => setOnlyHighlights((v) => !v)}>Has highlights</Toggle>
          <Toggle on={onlyTm} onClick={() => setOnlyTm((v) => !v)}>Has Transfermarkt</Toggle>
          {tests > 0 && <Toggle on={showTests} onClick={() => setShowTests((v) => !v)}>Show tests ({tests})</Toggle>}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {POSITIONS.map((p) => (
            <button
              key={p}
              onClick={() => setPos((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]))}
              className={`rounded-md px-2.5 py-1 text-xs font-bold ${pos.includes(p) ? "bg-lime text-ink" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
            >
              {p}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-white/40">
          Showing {rows.length} of {showTests ? apps.length : real.length}
          {filtered ? " · " : ""}
          {filtered && (
            <button
              onClick={() => { setQ(""); setFee(""); setPassport(""); setPos([]); setRegion(""); setOnlyHighlights(false); setOnlyTm(false); }}
              className="font-semibold text-lime hover:underline"
            >
              clear filters
            </button>
          )}
        </p>
      </section>

      {/* list */}
      {apps.length === 0 ? (
        <p className="mt-16 text-center text-white/50">No applications yet. They&apos;ll appear here the moment someone applies.</p>
      ) : rows.length === 0 ? (
        <p className="mt-16 text-center text-white/50">Nobody matches those filters.</p>
      ) : (
        <section className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((a) => (
            <Card key={a.id} a={a} now={now} isNew={seenBefore !== null && (a.submittedAt?.getTime() ?? 0) > seenBefore} />
          ))}
        </section>
      )}
    </>
  );
}

function Stat({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-white/50">{label}</p>
      <p className="mt-1 font-display text-5xl leading-none text-lime">{value}</p>
      <p className="mt-2 text-xs text-white/50">{sub}</p>
    </div>
  );
}

function SplitBar({ parts }: { parts: [string, number, string][] }) {
  const total = parts.reduce((s, [, n]) => s + n, 0);
  return (
    <>
      <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-white/5">
        {total > 0 && parts.map(([k, n, c]) => <div key={k} className={c} style={{ width: `${(n / total) * 100}%` }} />)}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {parts.map(([k, n, c]) => (
          <span key={k} className="flex items-center gap-1.5 text-sm">
            <span className={`h-2 w-2 rounded-full ${c}`} />
            <span className="text-white/60">{k}</span>
            <span className="font-bold">{n}</span>
          </span>
        ))}
      </div>
    </>
  );
}

function Seg({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center overflow-hidden rounded-full border border-white/10 bg-card text-xs font-semibold">
      <span className="px-3 text-white/40">{label}</span>
      {["", ...options].map((o) => (
        <button key={o || "any"} onClick={() => onChange(o)} className={`px-3 py-1.5 ${value === o ? "bg-lime text-ink" : "text-white/70 hover:bg-white/5"}`}>
          {o || "Any"}
        </button>
      ))}
    </div>
  );
}

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${on ? "border-lime bg-lime/10 text-lime" : "border-white/10 bg-card text-white/70 hover:border-white/25"}`}>
      {children}
    </button>
  );
}

const FEE_STYLE: Record<string, string> = {
  Yes: "bg-lime text-ink",
  Maybe: "bg-amber-400 text-ink",
  No: "bg-white/10 text-white/60",
};

function Card({ a, isNew, now }: { a: App; isNew: boolean; now: number }) {
  const [open, setOpen] = useState(false);
  const wa = waLink(a.whatsapp, a.region);
  const hl = webLink(a.highlights);
  const tm = webLink(a.transfermarkt);
  const h = handleLinks(a.handle);
  const btn = "rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 hover:border-white/40";
  return (
    <article className={`flex flex-col rounded-2xl border bg-card p-5 ${isNew ? "border-lime/60" : "border-line"} ${a.isTest ? "opacity-50" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold leading-tight">{a.name || "No name"}</h3>
          <p className="mt-1 text-sm text-white/55">
            {[a.age && `Age ${a.age}`, a.region].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="shrink-0 text-right">
          {isNew && <span className="rounded-full bg-lime px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-ink">New</span>}
          {a.isTest && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white/70">Test</span>}
          <p className="mt-1 text-xs text-white/40">{when(a.submittedAt, now)}</p>
        </div>
      </div>

      {a.positions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {a.positions.map((p) => (
            <span key={p} className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-bold">{p}</span>
          ))}
        </div>
      )}
      {a.level && <p className={`mt-3 text-sm text-white/80 ${open ? "" : "line-clamp-2"}`}>{a.level}</p>}
      {a.status && <p className="mt-1 text-xs text-white/45">{a.status}</p>}

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
        <span className={`rounded-full px-2.5 py-1 ${FEE_STYLE[a.payFee] ?? "bg-white/5 text-white/40"}`}>
          Pay: {a.payFee || "not asked"}
        </span>
        <span className={`rounded-full px-2.5 py-1 ${a.passport === "Yes" ? "bg-white/10 text-white" : a.passport === "No" ? "bg-red-500/15 text-red-300" : "bg-white/5 text-white/40"}`}>
          Passport: {a.passport === "Yes" ? a.passportCountry || "Yes" : a.passport || "not asked"}
        </span>
        {a.ref && <span className="rounded-full bg-white/5 px-2.5 py-1 text-white/50">via {a.ref}</span>}
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-bold text-ink hover:brightness-110">
            WhatsApp
          </a>
        )}
        {hl && <a href={hl} target="_blank" rel="noopener noreferrer" className={btn}>Highlights ↗</a>}
        {tm && <a href={tm} target="_blank" rel="noopener noreferrer" className={btn}>Transfermarkt ↗</a>}
        {h && <a href={h.main} target="_blank" rel="noopener noreferrer" className={btn}>{h.x ? "Instagram ↗" : "Profile ↗"}</a>}
        {h?.x && <a href={h.x} target="_blank" rel="noopener noreferrer" className={btn}>X ↗</a>}
        <button onClick={() => setOpen((o) => !o)} className="ml-auto text-xs font-semibold text-white/45 hover:text-white/80">
          {open ? "Less" : "All details"}
        </button>
      </div>

      {open && (
        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <Row k="WhatsApp" v={a.whatsapp} />
          <Row k="Instagram or X" v={a.handle} />
          <Row k="Highlights" v={a.highlights || "None"} />
          <Row k="Transfermarkt" v={a.transfermarkt || "Not asked"} />
          {a.notes && <Row k="Notes" v={a.notes} />}
          {a.earlier.map(([k, v]) => <Row key={k} k={k} v={v} />)}
          <Row k="Submitted" v={a.submittedAt ? a.submittedAt.toLocaleString("en-GB") : ""} />
        </dl>
      )}
    </article>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-2">
      <dt className="text-white/40">{k}</dt>
      <dd className="break-words text-white/85">{v}</dd>
    </div>
  );
}

// Made-up rows for the local ?sample=1 preview only (never shown in production).
function sampleRows(): Record<string, unknown>[] {
  const hoursAgo = (h: number) => Timestamp.fromDate(new Date(Date.now() - h * 3600_000));
  return [
    { name: "Sample Player One", whatsapp: "+44 7700 900111", handle: "@sample.one", region: "UK", age: "22", positions: "ST, RW", level: "Step 3 non-league, Sample Town FC", status: "Free agent", highlights: "youtu.be/sample1", passport: "Yes", passportCountry: "United Kingdom", transfermarkt: "No", payFee: "Yes", ref: "ig", submittedAt: hoursAgo(1) },
    { name: "Sample Player Two", whatsapp: "07700 900222", handle: "sampletwo", region: "UK", age: "19", positions: "CB", level: "U21s academy, Sample City", status: "Leaving my club", highlights: "", passport: "Yes", passportCountry: "Ireland", transfermarkt: "https://www.transfermarkt.co.uk/sample/profil/spieler/1", payFee: "Maybe", submittedAt: hoursAgo(2) },
    { name: "Sample Player Three", whatsapp: "+971 50 000 0333", handle: "@three_sample", region: "UAE", age: "25", positions: "CM, DM", level: "UAE Second Division, Sample SC, captain for two seasons and played every league game", status: "Under contract but open to a move", highlights: "https://youtube.com/watch?v=sample3", passport: "No", transfermarkt: "No", payFee: "No", submittedAt: hoursAgo(5) },
    { name: "Sample Player Four", whatsapp: "+33 6 00 00 04 44", handle: "@four", region: "Europe", age: "27", positions: "GK", level: "French National 3", status: "Free agent", highlights: "vimeo.com/sample4", passport: "Yes", passportCountry: "France", transfermarkt: "No", payFee: "Yes", submittedAt: hoursAgo(30) },
    { name: "Sample Player Five", whatsapp: "+44 7700 900555", handle: "@five", region: "UK", age: "21", positions: "LB, LW", level: "Sunday league", status: "Free agent", highlights: "", notes: "Passport: Yes (United Kingdom) | Transfermarkt: No | Willing to pay the fee: Maybe", submittedAt: hoursAgo(50) },
    { name: "TEST - Sample (delete me)", whatsapp: "+44 0000 000000", handle: "test", region: "UK", age: "30", positions: "ST", level: "test", status: "Free agent", wouldBook: "Maybe", submittedAt: hoursAgo(80) },
  ];
}
