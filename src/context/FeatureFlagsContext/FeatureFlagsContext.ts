import { createContext } from 'react';

export enum FeatureFlag {
  CRYPTO_TO_FIAT = 'CRYPTO_TO_FIAT',
}

export const FeatureFlagsContext = createContext<{
  [key in FeatureFlag]?: boolean;
}>({});
