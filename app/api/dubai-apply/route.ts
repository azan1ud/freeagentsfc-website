import { NextResponse } from "next/server";

// Saves to Firestore (talentbase-app) collection `dubaiApplications`.
// Rules allow create-only with this exact shape; nobody but admins can
// read them back. The web API key is the app's public client key.
const PROJECT = "talentbase-app";
const API_KEY = "AIzaSyB4sIJQY8JBa2PQhfMh6zL9bf8qxuqHNNI";
const DOCS = `projects/${PROJECT}/databases/(default)/documents`;
const COMMIT_URL = `https://firestore.googleapis.com/v1/${DOCS}:commit?key=${API_KEY}`;

const FIELDS = [
  "name",
  "whatsapp",
  "handle",
  "region",
  "age",
  "positions",
  "level",
  "status",
  "highlights",
  "priceShown",
  "wouldBook",
  "deposit",
  "dates",
  "notes",
  "ref",
] as const;

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

  const fields: Record<string, { stringValue: string }> = {};
  for (const k of FIELDS) {
    fields[k] = { stringValue: String(body[k] ?? "").trim().slice(0, 1000) };
  }
  if (!fields.name.stringValue || !fields.whatsapp.stringValue) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const res = await fetch(COMMIT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      writes: [
        {
          update: {
            name: `${DOCS}/dubaiApplications/${crypto.randomUUID()}`,
            fields,
          },
          updateTransforms: [
            { fieldPath: "submittedAt", setToServerValue: "REQUEST_TIME" },
          ],
          currentDocument: { exists: false },
        },
      ],
    }),
  });
  if (!res.ok) {
    console.error("[dubai-apply] firestore", res.status, await res.text());
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
