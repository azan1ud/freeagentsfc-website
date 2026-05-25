import { NextResponse } from "next/server";

// Apple Universal Links manifest.
//
// Hosted at https://freeagentsfc.com/.well-known/apple-app-site-association
// Apple's CDN checks this file when the user taps a freeagentsfc.com link —
// matching paths are routed to the FreeAgentsFC app if installed, or fall
// through to the web page (which then prompts the App Store).
//
// applinks.details.appIDs:  "<TEAM_ID>.<BUNDLE_ID>"
//   - Bundle ID: uk.keplo.talentbase  (Codemagic-built iOS app)
//   - Team ID:  ⚠️ replace ABCDE12345 with the actual 10-char Apple
//     Team ID from developer.apple.com → Account → Membership.
//
// Paths claimed by the app:
//   /r/*   — affiliate referral landing pages
//   (we intentionally do NOT claim every path — the marketing pages
//    should stay browser-resolvable.)
const PAYLOAD = {
  applinks: {
    apps: [],
    details: [
      {
        appIDs: ["X5LAZ2X9W7.uk.keplo.talentbase"],
        components: [
          {
            "/": "/r/*",
            comment: "Affiliate referral landing — deep-link into the app",
          },
        ],
      },
    ],
  },
  webcredentials: {
    apps: ["X5LAZ2X9W7.uk.keplo.talentbase"],
  },
};

export async function GET() {
  return NextResponse.json(PAYLOAD, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=600",
    },
  });
}
