import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        white: "var(--white)",
        "gray-line": "var(--gray-line)",
        text: "var(--text)",
        "text-highlight": "var(--text-highlight)",
        title: "var(--title)",
        red: "var(--red)",
        green: "var(--green)",
        blue: "var(--blue)",
        "blue-dark": "var(--blue-dark)",
        "blue-twitter": "var(--blue-twitter)",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        rajdhani: ["var(--font-rajdhani)", "Rajdhani", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      fontSize: {
        "1.5": "1.5rem",
        "2": "2rem",
        "2.5": "2.5rem",
        "3": "3rem",
        "4": "4rem",
        "5": "5rem",
        "6": "6rem",
      },
      spacing: {
        "0.5": "0.5rem",
        "1.5": "1.5rem",
        "2.5": "2.5rem",
        "3.5": "3.5rem",
        "4.5": "4.5rem",
        "5.5": "5.5rem",
      },
    },
  },
  plugins: [],
} satisfies Config;