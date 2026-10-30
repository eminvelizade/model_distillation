import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Built into dist/ and served by FastAPI (python app.py). `npm run dev` proxies /api to a running app.
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: { outDir: "dist", emptyOutDir: true, sourcemap: false, chunkSizeWarningLimit: 900 },
  server: { proxy: { "/api": "http://127.0.0.1:8765" } },
});
