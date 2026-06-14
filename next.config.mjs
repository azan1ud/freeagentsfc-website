/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Branded share-link routing. The FreeAgentsFC app shares profile
  // links as https://freeagentsfc.com/p/<uid>, but the actual profile
  // page is rendered by the Flutter project's Firebase Hosting target
  // (talentbase-app.web.app/p/index.html?uid=<uid>). This rewrite
  // proxies /p/* on the marketing domain to that Firebase page so users
  // see a clean freeagentsfc.com URL while the page is still served
  // from the Firebase project that owns the Firestore data.
  async rewrites() {
    return [
      {
        source: "/p/:uid",
        destination:
          "https://talentbase-app.web.app/p/index.html?uid=:uid",
      },
      // Community-post share links: https://freeagentsfc.com/c/<postId>
      // proxy to the Firebase-hosted /c/ landing page (same project that
      // owns the Firestore feedItems data), mirroring the /p/ rewrite.
      {
        source: "/c/:id",
        destination:
          "https://talentbase-app.web.app/c/index.html?id=:id",
      },
    ];
  },
};

export default nextConfig;
