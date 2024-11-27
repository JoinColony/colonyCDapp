export enum FeatureFlag {
  CRYPTO_TO_FIAT = 'CRYPTO_TO_FIAT',
  CRYPTO_TO_FIAT_WITHDRAWALS = 'CRYPTO_TO_FIAT_WITHDRAWALS',
  ARBITRARY_TXS_ACTION = 'ARBITRARY_TXS_ACTION',
}

export interface FeatureFlagValue {
  isEnabled: boolean;
  isLoading: boolean;
}

export type FeatureFlagsContextValue = {
  [key in FeatureFlag]?: FeatureFlagValue;
};
