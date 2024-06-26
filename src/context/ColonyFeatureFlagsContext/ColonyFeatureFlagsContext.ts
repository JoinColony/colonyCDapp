import { createContext } from 'react';

export enum ColonyFeatureFlag {
  CRYPTO_TO_FIAT = 'CRYPTO_TO_FIAT',
}

export const ColonyFeatureFlagsContext = createContext<{
  [key in ColonyFeatureFlag]?: boolean;
}>({});
