export enum FeatureFlag {
  CRYPTO_TO_FIAT = 'CRYPTO_TO_FIAT',
  CRYPTO_TO_FIAT_WITHDRAWALS = 'CRYPTO_TO_FIAT_WITHDRAWALS',
  GUIDED_TOURS = 'GUIDED_TOURS',
  ARBITRARY_TXS_ACTION = 'ARBITRARY_TXS_ACTION',
  SUPPORTED_CHAINS_ACTION = 'SUPPORTED_CHAINS_ACTION',
}

export interface FeatureFlagValue {
  isEnabled: boolean;
  isLoading: boolean;
}

export type FeatureFlagsContextValue = {
  [key in FeatureFlag]?: FeatureFlagValue;
};
