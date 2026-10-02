"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// The app's public web client config (same project as the mobile app,
// lib/firebase_options.dart). Access is enforced by the Firestore rules:
// dubaiApplications is readable only by isAdmin() emails.
const config = {
  apiKey: "AIzaSyB4sIJQY8JBa2PQhfMh6zL9bf8qxuqHNNI",
  authDomain: "talentbase-app.firebaseapp.com",
  projectId: "talentbase-app",
  appId: "1:357766116995:web:2e00f1f62bc20614610db6",
  messagingSenderId: "357766116995",
};

let cached: { app: FirebaseApp; auth: Auth; db: Firestore } | null = null;

// Initialised lazily so nothing touches Firebase during the server render.
export function fb() {
  if (!cached) {
    const app = getApps().length ? getApp() : initializeApp(config);
    cached = { app, auth: getAuth(app), db: getFirestore(app) };
  }
  return cached;
}
