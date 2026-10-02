import type { Metadata } from "next";
import Viewer from "./Viewer";

// Admin-only view of the /dubai applications. The page itself holds no
// data: everything is read live from Firestore after an admin signs in.
export const metadata: Metadata = {
  title: "Dubai applications · FreeAgentsFC",
  robots: { index: false, follow: false },
};

export default function ApplicationsPage() {
  return <Viewer />;
}
