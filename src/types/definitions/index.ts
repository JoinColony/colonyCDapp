/* eslint-disable @typescript-eslint/no-unused-vars */

interface Brand {
  brand: string;
  version: string;
}

interface Navigator {
  userAgentData?: {
    platform: string;
    mobile: boolean;
    brands: Brand[];
  };
}
