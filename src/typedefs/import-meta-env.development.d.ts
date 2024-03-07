// This extends the `import.meta.env` object, defined in import-meta-env.d.ts
interface ImportMetaEnv {
  // Development only (needs to be prefixed with VITE_)
  readonly VITE_DEBUG: string;
  readonly VITE_GANACHE_RPC_URL: string;
  readonly VITE_NETWORK_FILES_ENDPOINT: string;
}
