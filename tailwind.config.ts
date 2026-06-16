import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Match the FreeAgentsFC mobile app palette exactly so the
        // website doesn't feel like a different product.
        ink: "#0A0B0D",
        card: "#14161A",
        lime: "#C6F806",
        line: "rgba(255,255,255,0.06)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        // BrickRecords = the app's own brand display face (shipped
        // in-app). Anton is the closest webfont stand-in if it ever
        // fails to load.
        display: ["BrickRecords", "Anton", "Impact", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
