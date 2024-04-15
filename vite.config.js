import { defineConfig } from "vite";
import { resolve } from "path";

const showPagesUrlPlugin = () => {
  let config;

  return {
    name: "read-config",
    /**
     * @param {import("vite").ResolvedConfig} resolvedConfig
     */
    configResolved(resolvedConfig) {
      // store the resolved config
      config = resolvedConfig;

      if (config.command === "serve") {
        // dev: plugin invoked by dev server
        const baseUrl = `http://localhost:${config.server.port}`;
        const pageRoot = "src/pages";

        const myNotesUrl = `${baseUrl}/${pageRoot}/my-notes/`;
        const notesSharedWithMe = `${baseUrl}/${pageRoot}/my-shared-documents/`;
        const notesSharingInvite = `${baseUrl}/${pageRoot}/document-shared-invite/`;
        const pathologiesUrl = `${baseUrl}/${pageRoot}/pathologies/`;

        console.group("Pages Urls");
        console.log(`- My notes: ${myNotesUrl}`);
        console.log(`- Notes Shared with me: ${notesSharedWithMe}`);
        console.log(`- Shared note invitation: ${notesSharingInvite}`);
        console.log(`- Pathologies: ${pathologiesUrl}`);
        console.groupEnd();
      }
    },
  };
};

export default defineConfig({
  server: {
    port: 3021,
  },
  plugins: [showPagesUrlPlugin()],
  resolve: {
    alias: {
      "@assets": resolve(__dirname, "./src/assets"),
      "@components": resolve(__dirname, "./src/components"),
      "@store": resolve(__dirname, "./src/store"),
      "@services": resolve(__dirname, "./src/services"),
      "@pages": resolve(__dirname, "./src/pages"),
      "@utils": resolve(__dirname, "./src/utils"),
      "@interfaces": resolve(__dirname, "./src/interfaces"),
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
