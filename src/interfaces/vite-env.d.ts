/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ORDOTYPE_API: string;
  readonly VITE_API_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
