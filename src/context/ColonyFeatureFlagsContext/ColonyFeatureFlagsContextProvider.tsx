import React, { type FC, type PropsWithChildren, useMemo } from 'react';

import {
  ColonyFeatureFlag,
  ColonyFeatureFlagsContext,
} from './ColonyFeatureFlagsContext.ts';
import { useColonyFeatureFlag } from './useColonyFeatureFlag.ts';

const ColonyFeatureFlagsContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const cryptoToFiatFeature = useColonyFeatureFlag(
    ColonyFeatureFlag.CRYPTO_TO_FIAT,
  );

  const featureFlags = useMemo(
    () => ({
      [ColonyFeatureFlag.CRYPTO_TO_FIAT]: cryptoToFiatFeature,
    }),
    [cryptoToFiatFeature],
  );

  return (
    <ColonyFeatureFlagsContext.Provider value={featureFlags}>
      {children}
    </ColonyFeatureFlagsContext.Provider>
  );
};

export default ColonyFeatureFlagsContextProvider;
