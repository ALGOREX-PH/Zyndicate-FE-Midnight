/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Origin of the Zyndicate coordination service, e.g.
   * `https://zyndicate-api.onrender.com`. Leave unset to use a relative
   * `/api/v1` path (Vite's dev proxy, or a host-level rewrite).
   */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
