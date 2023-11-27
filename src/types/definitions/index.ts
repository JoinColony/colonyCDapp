/* eslint-disable @typescript-eslint/no-unused-vars */

interface Window {
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
