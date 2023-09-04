/* eslint-disable @typescript-eslint/no-unused-vars */

interface Window {
  // @ts-expect-error
  ethereum: object | undefined;
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
