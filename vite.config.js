import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  server: {
    port: 3021,
  },
  build: {
    target: "esnext",
    emptyOutDir: true,
    sourcemap: false,
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
        // manualChunks(id, { getModuleIds, getModuleInfo }) {
        //   if (id.includes("algolia")) {
        //     return "algolia";
        //   }
        // },
      },
    },
  },
});
