import { NextResponse } from "next/server";

// Android App Links manifest.
//
// Hosted at https://freeagentsfc.com/.well-known/assetlinks.json
// When a user taps a freeagentsfc.com link on Android, the system checks
// this file — matching paths open in the FreeAgentsFC app (no chooser
// dialog) if installed.
//
// package_name: com.freeagentsfc.app  (renamed from com.avantstudios.scout_app
//   on 2026-05-25 during the Android Play Store launch prep).
// sha256_cert_fingerprints: the SHA-256 of the release keystore
//   `android/app/freeagentsfc-release.jks` (alias `freeagentsfc`).
//
// If the keystore is rotated, regenerate this fingerprint via:
//   keytool -list -v -keystore freeagentsfc-release.jks -alias freeagentsfc
const PAYLOAD = [
  {
    relation: [
      "delegate_permission/common.handle_all_urls",
      "delegate_permission/common.get_login_creds",
    ],
    target: {
      namespace: "android_app",
      package_name: "com.freeagentsfc.app",
      sha256_cert_fingerprints: [
        "40:EA:88:69:6D:30:69:FD:86:08:46:6B:E7:8B:8A:85:0C:F2:41:6E:E8:C9:96:88:6D:F3:FE:64:5D:2A:ED:CD",
      ],
    },
  },
];

export async function GET() {
  return NextResponse.json(PAYLOAD, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=600",
    },
  });
}
