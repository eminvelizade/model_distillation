/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist Variable", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["Geist Mono Variable", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      colors: {
        // semantic tokens (defined per theme in index.css)
        canvas: v("canvas"),
        surface: v("surface"),
        raised: v("raised"),
        line: v("line"),
        fg: v("fg"),
        muted: v("muted"),
        subtle: v("subtle"),
        accent: v("accent"),
        code: v("code"),
        ink: { 50: "#f7f7f8", 100: "#efeff2", 200: "#e2e2e7", 300: "#c8c8d0", 400: "#9898a6", 500: "#6e6e7c", 600: "#52525e", 700: "#3a3a44", 800: "#26262d", 850: "#1c1c22", 900: "#141418", 950: "#0b0b0e" },
      },
      fontSize: { "2xs": ["10.5px", "14px"] },
      boxShadow: {
        // theme-aware (index.css): cool-tinted in light, a faint top highlight in dark
        soft: "var(--shadow-soft)",
        lift: "var(--shadow-lift)",
        glow: "0 0 0 1px rgb(20 184 166 / .25), 0 8px 28px -6px rgb(20 184 166 / .45)",
        inset: "inset 0 1px 0 rgb(255 255 255 / .12)",
      },
      keyframes: {
        bob: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-2px)" } },
        enter: { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "none" } },
        fade: { from: { opacity: "0" }, to: { opacity: "1" } },
        pop: { from: { opacity: "0", transform: "scale(.97) translateY(4px)" }, to: { opacity: "1", transform: "none" } },
        shimmer: { from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } },
        ping2: { "0%": { transform: "scale(1)", opacity: ".6" }, "80%,100%": { transform: "scale(2.4)", opacity: "0" } },
        spin: { to: { transform: "rotate(360deg)" } },
        twinkle: { "0%,100%": { opacity: ".15", transform: "scale(.7)" }, "50%": { opacity: ".95", transform: "scale(1)" } },
        growx: { from: { transform: "scaleX(0)" } },
        growy: { from: { transform: "scaleY(0)" } },
        draw: { from: { strokeDashoffset: "1" }, to: { strokeDashoffset: "0" } },
        popin: { from: { transform: "scale(0)", opacity: "0" } },
        ripple: { from: { transform: "scale(1)", opacity: ".55" }, to: { transform: "scale(3.2)", opacity: "0" } },
        rise: { "0%": { transform: "translateY(0) scale(.5)", opacity: "0" }, "25%": { opacity: ".9" }, "100%": { transform: "translateY(-14px) scale(1)", opacity: "0" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-1.5px)" } },
      },
      animation: {
        bob: "bob 2.4s ease-in-out infinite",
        // "backwards", not "both": a lingering transform would trap position:fixed children (toasts, selection bar)
        enter: "enter .45s cubic-bezier(.2,.7,.2,1) backwards",
        fade: "fade .2s ease-out both",
        pop: "pop .22s cubic-bezier(.2,.7,.2,1) both",
        shimmer: "shimmer 2.2s linear infinite",
        ping2: "ping2 1.8s cubic-bezier(0,0,.2,1) infinite",
        "spin-slow": "spin 1.6s linear infinite",
        twinkle: "twinkle 3.2s ease-in-out infinite",
        growx: "growx .9s cubic-bezier(.2,.7,.2,1) backwards",
        growy: "growy .8s cubic-bezier(.2,.7,.2,1) backwards",
        draw: "draw 1.4s cubic-bezier(.4,0,.2,1) .2s backwards",
        popin: "popin .5s cubic-bezier(.34,1.56,.64,1) backwards",
        ripple: "ripple .7s ease-out forwards",
        rise: "rise 3.4s ease-out infinite",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
