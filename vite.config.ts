import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Split rarely-changing vendor code out of the app chunk so the
        // initial payload shrinks and vendor bundles stay cacheable.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router)[\\/]/.test(id)) {
            return "vendor-react";
          }
          if (/[\\/]node_modules[\\/]@tanstack[\\/]/.test(id)) return "vendor-query";
          if (/[\\/]node_modules[\\/]@noble[\\/]/.test(id)) return "vendor-crypto";
          if (/[\\/]node_modules[\\/]@midnight-ntwrk[\\/]/.test(id)) return "vendor-midnight";
          if (/[\\/]node_modules[\\/](zod|zustand|semver)[\\/]/.test(id)) return "vendor-util";
          return;
        },
      },
    },
  },
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
