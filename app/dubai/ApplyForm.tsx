"use client";

import { useEffect, useState } from "react";

const REGIONS = ["UK", "Europe", "UAE", "Other Middle East", "Other"];
const POSITIONS = ["GK", "RB", "CB", "LB", "DM", "CM", "AM", "RW", "LW", "ST"];
const STATUSES = [
  "Free agent",
  "Leaving my club",
  "Under contract but open to a move",
];

type Form = {
  name: string;
  whatsapp: string;
  handle: string;
  region: string;
  age: string;
  positions: string[];
  level: string;
  status: string;
  hasHighlights: string;
  highlights: string;
  website: string; // honeypot, stays empty for humans
};

const EMPTY: Form = {
  name: "",
  whatsapp: "",
  handle: "",
  region: "",
  age: "",
  positions: [],
  level: "",
  status: "",
  hasHighlights: "",
  highlights: "",
  website: "",
};

export default function ApplyForm() {
  const [f, setF] = useState<Form>(EMPTY);
  const [missing, setMissing] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [ref, setRef] = useState("");

  useEffect(() => {
    setRef(new URLSearchParams(window.location.search).get("ref") ?? "");
  }, []);

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setF((p) => ({ ...p, [k]: v }));

  const togglePosition = (p: string) =>
    setF((prev) => ({
      ...prev,
      positions: prev.positions.includes(p)
        ? prev.positions.filter((x) => x !== p)
        : [...prev.positions, p],
    }));

  function check() {
    const m: string[] = [];
    if (!f.name.trim()) m.push("name");
    if (f.whatsapp.replace(/\D/g, "").length < 8) m.push("whatsapp");
    if (!f.handle.trim()) m.push("handle");
    if (!f.region) m.push("region");
    const age = Number(f.age);
    if (!age || age < 14 || age > 60) m.push("age");
    if (f.positions.length === 0) m.push("positions");
    if (!f.level.trim()) m.push("level");
    if (!f.status) m.push("status");
    if (!f.hasHighlights) m.push("hasHighlights");
    if (f.hasHighlights === "Yes" && !f.highlights.trim()) m.push("highlights");
    return m;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const m = check();
    setMissing(m);
    if (m.length) {
      document
        .querySelector(`[data-field="${m[0]}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/dubai-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...f,
          positions: f.positions.join(", "),
          highlights: f.hasHighlights === "Yes" ? f.highlights : "",
          ref,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="mt-12 rounded-3xl border border-lime/30 bg-card p-8">
        <p className="font-display text-4xl uppercase leading-none text-lime">
          You&apos;re in
        </p>
        <p className="mt-4 text-white/80">
          Thanks {f.name.split(" ")[0]}. We&apos;ve got your application and
          we&apos;ll message you on WhatsApp at{" "}
          <span className="font-semibold text-white">{f.whatsapp}</span>.
        </p>
      </div>
    );
  }

  const bad = (k: string) => missing.includes(k);

  return (
    <form onSubmit={submit} noValidate className="mt-12 space-y-10">
      <Group title="You">
        <Field id="name" label="Full name" bad={bad("name")}>
          <Input
            id="f-name"
            value={f.name}
            onChange={(v) => set("name", v)}
            autoComplete="name"
          />
        </Field>
        <Field
          id="whatsapp"
          label="WhatsApp number"
          hint="With country code, e.g. +44 7700 900123"
          bad={bad("whatsapp")}
        >
          <Input
            id="f-whatsapp"
            value={f.whatsapp}
            onChange={(v) => set("whatsapp", v)}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+44"
          />
        </Field>
        <Field id="handle" label="Instagram or X handle" bad={bad("handle")}>
          <Input
            id="f-handle"
            value={f.handle}
            onChange={(v) => set("handle", v)}
            placeholder="@"
            autoCapitalize="none"
          />
        </Field>
        <Field id="region" label="Where are you based?" bad={bad("region")}>
          <Chips
            options={REGIONS}
            value={f.region}
            onChange={(v) => set("region", v)}
          />
        </Field>
        <Field id="age" label="Age" bad={bad("age")}>
          <Input
            id="f-age"
            value={f.age}
            onChange={(v) => set("age", v.replace(/\D/g, "").slice(0, 2))}
            inputMode="numeric"
            className="max-w-[7rem]"
          />
        </Field>
      </Group>

      <Group title="Your football">
        <Field
          id="positions"
          label="Position(s)"
          hint="Pick all you play"
          bad={bad("positions")}
        >
          <Chips
            options={POSITIONS}
            multi={f.positions}
            onChange={togglePosition}
          />
        </Field>
        <Field
          id="level"
          label="Highest level you've played, and the club"
          bad={bad("level")}
        >
          <Input
            id="f-level"
            value={f.level}
            onChange={(v) => set("level", v)}
            placeholder="e.g. Step 4, Example Town FC"
          />
        </Field>
        <Field id="status" label="Current status" bad={bad("status")}>
          <Chips
            options={STATUSES}
            value={f.status}
            onChange={(v) => set("status", v)}
          />
        </Field>
        <Field
          id="hasHighlights"
          label="Do you have highlights?"
          bad={bad("hasHighlights")}
        >
          <Chips
            options={["Yes", "No"]}
            value={f.hasHighlights}
            onChange={(v) => set("hasHighlights", v)}
          />
        </Field>
        {f.hasHighlights === "Yes" && (
          <Field
            id="highlights"
            label="Paste the link"
            bad={bad("highlights")}
          >
            <Input
              id="f-highlights"
            value={f.highlights}
              onChange={(v) => set("highlights", v)}
              type="url"
              inputMode="url"
              placeholder="https://"
              autoCapitalize="none"
            />
          </Field>
        )}
      </Group>

      {/* Honeypot: hidden from people, bots fill it. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={f.website}
        onChange={(e) => set("website", e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      <div>
        {missing.length > 0 && (
          <p className="mb-4 text-sm font-semibold text-red-400">
            A few answers are missing. They&apos;re marked in red above.
          </p>
        )}
        {state === "error" && (
          <p className="mb-4 text-sm font-semibold text-red-400">
            That didn&apos;t send. Check your connection and try again.
          </p>
        )}
        <button
          type="submit"
          disabled={state === "sending"}
          className="w-full rounded-full bg-lime px-8 py-4 text-base font-extrabold uppercase tracking-wide text-ink transition hover:brightness-110 disabled:opacity-60 sm:w-auto"
        >
          {state === "sending" ? "Sending…" : "Send application"}
        </button>
      </div>
    </form>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-7 border-t border-white/10 pt-8">
      <legend className="float-left mb-1 w-full text-xs font-bold uppercase tracking-[0.2em] text-white/40">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Field({
  id,
  label,
  hint,
  bad,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  bad?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div data-field={id} className="clear-both">
      <label
        id={`l-${id}`}
        htmlFor={`f-${id}`}
        className={`block font-semibold ${bad ? "text-red-400" : ""}`}
      >
        {label}
      </label>
      {hint && <p className="mt-1 text-sm text-white/45">{hint}</p>}
      <div className="mt-3" role="group" aria-labelledby={`l-${id}`}>
        {children}
      </div>
    </div>
  );
}

function Input({
  value,
  onChange,
  className = "",
  ...rest
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <input
      {...rest}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-2xl border border-white/10 bg-card px-4 py-3 text-base text-white placeholder-white/30 outline-none transition focus:border-lime ${className}`}
    />
  );
}

function Chips({
  options,
  value,
  multi,
  onChange,
}: {
  options: string[];
  value?: string;
  multi?: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = multi ? multi.includes(o) : value === o;
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o)}
            className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
              on
                ? "border-lime bg-lime text-ink"
                : "border-white/15 bg-card text-white/80 hover:border-white/40"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
