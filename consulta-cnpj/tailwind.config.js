/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      colors: {
        muted: "#6B7280",
        line: "#E5E7EB",
        success: "#16A34A",
        danger: "#DC2626",
        info: "#2563EB",
        warn: "#D97706",
      },
    },
  },
  plugins: [],
};
