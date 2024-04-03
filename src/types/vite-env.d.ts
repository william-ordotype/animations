/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KLEVER_API_URL: string;
  readonly VITE_ORDOTYPE_API: string;
  readonly VITE_API_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
