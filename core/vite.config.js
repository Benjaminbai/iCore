import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: "./index.js",
      formats: ["es"],
      fileName: "index.js",
    },
    rollupOptions: {
      output: {
        preserveModules: true,
        entryFileNames: "index.js",
      },
      external: [
        "axios",
        "ant-design-vue",
        "vue",
        "@tinymce/tinymce-vue",
        "tinymce",
        "vue-codemirror",
        "vue-router",
        "vuedraggable",
        "@ant-design/icons-vue",
      ],
    },
  },
  plugins: [
    vue(),
    obfuscatorPlugin({
      options: {
        compact: true,
        identifierNamesGenerator: "mangled-shuffled",
        renameGlobals: false,
      },
    }),
  ],
});
