declare module '*.css' {
  interface ClassNames {
    [className: string]: string;
  }
  const classNames: ClassNames;
  export = classNames;
}

declare module '*.svg?react' {
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

// eslint-disable-next-line no-underscore-dangle
declare const __COMMIT_HASH__: string | undefined;
