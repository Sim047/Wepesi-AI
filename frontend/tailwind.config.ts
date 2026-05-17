import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        line: "#d9e2ee",
        paper: "#f4f7fb",
        signal: "#07847f",
        amber: "#c97912",
        coral: "#d9573f",
        mint: "#dff6ef",
        midnight: "#0b1220"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
