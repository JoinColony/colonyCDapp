import { usePostHog } from 'posthog-js/react';
import React, {
  type FC,
  type PropsWithChildren,
  useMemo,
  useEffect,
} from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';

import { FeatureFlagsContext } from './FeatureFlagsContext.ts';
import { FeatureFlag } from './types.ts';
import { useFeatureFlag } from './useFeatureFlag.ts';

const POSTHOG_WALLET_ADDRESS_PROPERTY_NAME = 'wallet_address';

const FeatureFlagsContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const posthog = usePostHog();

  const { wallet } = useAppContext();
  const { address: walletAddress } = wallet ?? {};

  useEffect(() => {
    if (!walletAddress) {
      return;
    }

    posthog.capture('$set', {
      $set: { [POSTHOG_WALLET_ADDRESS_PROPERTY_NAME]: walletAddress },
    });
  }, [posthog, walletAddress]);

  const cryptoToFiatFeature = useFeatureFlag(FeatureFlag.CRYPTO_TO_FIAT);
  const cryptoToFiatWithdrawalsFeature = useFeatureFlag(
    FeatureFlag.CRYPTO_TO_FIAT_WITHDRAWALS,
  );
  const guidedToursFeature = useFeatureFlag(FeatureFlag.GUIDED_TOURS);
  const arbitraryTxsAction = useFeatureFlag(FeatureFlag.ARBITRARY_TXS_ACTION);
  const supportedChainsAction = useFeatureFlag(
    FeatureFlag.SUPPORTED_CHAINS_ACTION,
  );

  const featureFlags: Record<
    FeatureFlag,
    ReturnType<typeof useFeatureFlag>
  > = useMemo(
    () => ({
      [FeatureFlag.CRYPTO_TO_FIAT]: cryptoToFiatFeature,
      [FeatureFlag.CRYPTO_TO_FIAT_WITHDRAWALS]: cryptoToFiatWithdrawalsFeature,
      [FeatureFlag.GUIDED_TOURS]: guidedToursFeature,
      [FeatureFlag.ARBITRARY_TXS_ACTION]: arbitraryTxsAction,
      [FeatureFlag.SUPPORTED_CHAINS_ACTION]: supportedChainsAction,
    }),
    [
      cryptoToFiatFeature,
      cryptoToFiatWithdrawalsFeature,
      guidedToursFeature,
      arbitraryTxsAction,
      supportedChainsAction,
    ],
  );

  return (
    <FeatureFlagsContext.Provider value={featureFlags}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export default FeatureFlagsContextProvider;
