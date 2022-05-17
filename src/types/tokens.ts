import { Address } from './index';

export interface FixedToken {
  address: Address;
  symbol: string;
  name: string;
  decimals?: number;
  iconHash?: string;
}
