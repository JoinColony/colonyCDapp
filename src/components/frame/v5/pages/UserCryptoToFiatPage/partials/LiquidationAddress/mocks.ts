// @TODO Remove this once a better solution is found
// For testing purposes, I'm using this array as a fallback and
// I've added an extra guard to make sure it's never used
// outside of our dev sandbox.

import { type LiquidationAddress } from '~gql';

export const MOCK_LIQUIDATION_ADDRESSES: Pick<
  LiquidationAddress,
  'liquidationAddress'
>[] =
  import.meta.env.MODE === 'development'
    ? [
        {
          liquidationAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44a',
        },
        {
          liquidationAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44b',
        },
        {
          liquidationAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44c',
        },
      ]
    : [];
