/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0f0f0f", // Very dark grey, almost black
                surface: "#1e1e1e", // Slightly lighter for cards
                primary: "#e0e0e0", // High contrast text
                secondary: "#a0a0a0", // Secondary text
                accent: "#bb86fc", // Purple accent for premium feel (optional, can adjust)
                border: "#333333",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
