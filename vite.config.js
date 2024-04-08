import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  server: {
    port: 3021,
  },
  resolve: {
    alias: {
      "@assets": resolve(__dirname, "./src/assets"),
      "@components": resolve(__dirname, "./src/components"),
      "@store": resolve(__dirname, "./src/store"),
      "@services": resolve(__dirname, "./src/services"),
      "@pages": resolve(__dirname, "./src/pages"),
      "@utils": resolve(__dirname, "./src/utils"),
      "@types": resolve(__dirname, "./src/types"),
      // alias for JSDoc in JS files. Prefix @ doesn't work
      "#store": resolve(__dirname, "./src/store"),
      "#types": resolve(__dirname, "./src/types"),
    },
  },
  build: {
    target: "esnext",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        pathologies: resolve(__dirname, "./src/pages/pathologies/index.html"),
        notes: resolve(__dirname, "./src/pages/my-notes/index.html"),
        "shared-notes": resolve(
          __dirname,
          "./src/pages/my-shared-documents/index.html"
        ),
        "sharing-invitation": resolve(
          __dirname,
          "./src/pages/document-shared-invite/index.html"
        ),
      },
      output: {
        entryFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
        chunkFileNames: "assets/[name].js",
      },
    },
  },
});
