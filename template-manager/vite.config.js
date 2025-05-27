import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/AiScreenTemplates/',
  server: {
    proxy: {
      "/api": {
        target: "https://dev-api.aiscreen.io/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: false,
      },
    },
  },
});
