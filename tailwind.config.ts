import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: "#7C3AED",
        "accent-light": "#a78bfa",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      keyframes: {
        "gradient-slow": {
          "0%, 100%": { backgroundPosition: "0% 50%", backgroundSize: "200% 200%" },
          "50%": { backgroundPosition: "100% 50%", backgroundSize: "200% 200%" },
        },
      },
      animation: {
        "gradient-slow": "gradient-slow 6s ease infinite",
      },
    },
  },
  plugins: [],
};
export default config;
