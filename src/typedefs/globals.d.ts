declare module '*.css' {
  interface ClassNames {
    [className: string]: string;
  }
  const classNames: ClassNames;
  export = classNames;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

// Alternatively, if you want a more specific type for dataLayer entries
interface DataLayerObject {
  event: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

interface Window {
  dataLayer: DataLayerObject[];
  ethereum: object | undefined;
  Beamer: any;
}

interface Navigator {
  userAgentData?: {
    platform: string;
    mobile: boolean;
    brands: Brand[];
  };
}

interface Brand {
  brand: string;
  version: string;
}

interface ImportMetaEnv {
  readonly VITE_AUTH_PROXY_ENDPOINT: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_BSCSCAN_API_KEY: string | undefined;
  readonly VITE_COINGECKO_API_KEY: string;
  readonly VITE_DEBUG: string;
  readonly VITE_ETHERSCAN_API_KEY: string | undefined;
  readonly VITE_NETWORK_FILES_ENDPOINT: string;
  readonly VITE_GANACHE_RPC_URL: string | undefined;
  readonly VITE_GOOGLE_TAG_MANAGER_ID: string | undefined;
  readonly VITE_METATX_ENABLED: string;
  readonly VITE_METATX_BROADCASTER_ENDPOINT: string;
  readonly VITE_NETWORK: string;
  readonly VITE_NETWORK_CONTRACT_ADDRESS: string;
  readonly VITE_PINATA_API_KEY: string | undefined;
  readonly VITE_PINATA_API_SECRET: string | undefined;
  readonly VITE_REPUTATION_ORACLE_ENDPOINT: string;
  readonly VITE_PROD_COMMIT_HASH: string | undefined;
  readonly VITE_SAFE_ENABLED: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
