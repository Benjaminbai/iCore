import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5174,
    cors: true,
  },
  resolve: {
    alias: {
      "@core": path.resolve(__dirname, "core/dist"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      external: ["@core"],
    },
  },
});
