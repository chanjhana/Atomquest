import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Helvetica Neue", "Arial", "sans-serif"],
      },
      colors: {
        border: "#000000",
        background: "#FFFFFF",
        foreground: "#000000",
        primary: {
          DEFAULT: "#000000",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#FF3000",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F2F2F2",
          foreground: "#000000",
        },
      },
      boxShadow: {
        soft: "none",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
