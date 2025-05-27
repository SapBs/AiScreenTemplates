import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/AiScreenTemplates/',
  server: {
    proxy: {
      '^/AiScreenTemplates/api/.*': {
        target: 'https://dev-api.aiscreen.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/AiScreenTemplates\/api/, '/api'),
        secure: false,
      }
    }
  }
});
