/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ["var(--font-bricolage)", "sans-serif"],
                sans: ["var(--font-urbanist)", "sans-serif"],
            },
        },
    },
    plugins: [],
}