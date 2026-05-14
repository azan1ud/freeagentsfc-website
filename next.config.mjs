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
    ];
  },
};

export default nextConfig;
