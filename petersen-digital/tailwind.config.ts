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
        brand: {
          50:  "#edfcfd",
          100: "#d0f6fa",
          200: "#a6ebf5",
          300: "#68daec",
          400: "#22bfda",
          500: "#09a3bf",
          600: "#0b82a0",
          700: "#106881",
          800: "#155469",
          900: "#154758",
          950: "#082e3c",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
