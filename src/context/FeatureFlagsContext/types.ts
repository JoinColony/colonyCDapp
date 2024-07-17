export enum FeatureFlag {
  CRYPTO_TO_FIAT = 'CRYPTO_TO_FIAT',
  CRYPTO_TO_FIAT_WITHDRAWALS = 'CRYPTO_TO_FIAT_WITHDRAWALS',
}

export interface FeatureFlagValue {
  isEnabled: boolean;
  isLoading: boolean;
}

export type FeatureFlagsContextValue = {
  [key in FeatureFlag]?: FeatureFlagValue;
};
