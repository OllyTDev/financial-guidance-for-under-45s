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
        cream: {
          50: "#FDFBF7",
          100: "#F9F5EE",
          200: "#F0E8DC",
        },
        sand: {
          700: "#5C5346",
          800: "#3D3830",
          900: "#2A2620",
        },
      },
    },
  },
  plugins: [],
};

export default config;
