/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-rounded", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      colors: {
        ink: { 50: "#f7f7fb", 100: "#eeeef6", 200: "#dcdcea", 300: "#b9b9cf", 400: "#8e8eab", 500: "#686885", 600: "#4d4d68", 700: "#363650", 800: "#23233a", 850: "#1b1b2e", 900: "#141424", 950: "#0d0d18" },
      },
      boxShadow: { soft: "0 1px 2px rgba(20,20,40,.04), 0 4px 16px rgba(20,20,40,.06)" },
      keyframes: { bob: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-2px)" } } },
      animation: { bob: "bob 2.4s ease-in-out infinite" },
    },
  },
  plugins: [],
};
