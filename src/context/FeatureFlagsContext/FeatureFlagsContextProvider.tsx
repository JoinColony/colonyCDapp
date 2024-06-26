import React, { type FC, type PropsWithChildren, useMemo } from 'react';

import { FeatureFlag, FeatureFlagsContext } from './FeatureFlagsContext.ts';
import { useFeatureFlag } from './useFeatureFlag.ts';

const FeatureFlagsContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const cryptoToFiatFeature = useFeatureFlag(FeatureFlag.CRYPTO_TO_FIAT);

  const featureFlags = useMemo(
    () => ({
      [FeatureFlag.CRYPTO_TO_FIAT]: cryptoToFiatFeature,
    }),
    [cryptoToFiatFeature],
  );

  return (
    <FeatureFlagsContext.Provider value={featureFlags}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export default FeatureFlagsContextProvider;
