import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Zyndicate backend (built in parallel) — see src/api/client.ts
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
