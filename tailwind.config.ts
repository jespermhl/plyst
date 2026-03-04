/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-bricolage)", "sans-serif"],
        body: ["var(--font-urbanist)", "sans-serif"],
        sans: ["var(--font-urbanist)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
