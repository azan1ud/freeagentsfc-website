import { NextResponse } from "next/server";

// Saves to Firestore (talentbase-app) collection `dubaiApplications`.
// Rules allow create-only with a fixed set of field names; nobody but admins
// can read them back. The web API key is the app's public client key.
const PROJECT = "talentbase-app";
const API_KEY = "AIzaSyB4sIJQY8JBa2PQhfMh6zL9bf8qxuqHNNI";
const DOCS = `projects/${PROJECT}/databases/(default)/documents`;
const COMMIT_URL = `https://firestore.googleapis.com/v1/${DOCS}:commit?key=${API_KEY}`;

// Fields the original rule accepts. The rule requires a string `notes`, so it
// is always sent (empty unless it carries the fallback summary below).
const BASE = ["name", "whatsapp", "handle", "region", "age", "positions", "level", "status", "highlights", "ref"] as const;
// Added 2 Oct (Kamal): need the updated rule to be stored as their own fields.
const EXTRA = ["passport", "passportCountry", "transfermarkt", "payFee"] as const;

type Fields = Record<string, { stringValue: string }>;
const str = (v: unknown) => ({ stringValue: String(v ?? "").trim().slice(0, 1000) });

async function commit(fields: Fields) {
  return fetch(COMMIT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      writes: [
        {
          update: { name: `${DOCS}/dubaiApplications/${crypto.randomUUID()}`, fields },
          updateTransforms: [{ fieldPath: "submittedAt", setToServerValue: "REQUEST_TIME" }],
          currentDocument: { exists: false },
        },
      ],
    }),
  });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot filled = bot. Pretend it worked.
  if (typeof body.website === "string" && body.website) {
    return NextResponse.json({ ok: true });
  }

  const base: Fields = { notes: str("") };
  for (const k of BASE) base[k] = str(body[k]);
  if (!base.name.stringValue || !base.whatsapp.stringValue) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const extra: Fields = {};
  for (const k of EXTRA) extra[k] = str(body[k]);

  let res = await commit({ ...base, ...extra });
  if (res.status === 403) {
    // The rule hasn't been updated for the new questions yet: keep the answers,
    // readable, in `notes` (which the current rule accepts) so no application is lost.
    const e = (k: string) => extra[k].stringValue || "-";
    const summary =
      `Passport: ${e("passport")}${extra.passportCountry.stringValue ? ` (${extra.passportCountry.stringValue})` : ""}` +
      ` | Transfermarkt: ${e("transfermarkt")} | Willing to pay the fee: ${e("payFee")}`;
    res = await commit({ ...base, notes: str(summary) });
  }
  if (!res.ok) {
    console.error("[dubai-apply] firestore", res.status, await res.text());
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
