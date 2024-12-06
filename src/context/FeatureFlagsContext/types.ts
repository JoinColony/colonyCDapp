export enum FeatureFlag {
  CRYPTO_TO_FIAT = 'CRYPTO_TO_FIAT',
  CRYPTO_TO_FIAT_WITHDRAWALS = 'CRYPTO_TO_FIAT_WITHDRAWALS',
  GUIDED_TOURS = 'GUIDED_TOURS',
}

export interface FeatureFlagValue {
  isEnabled: boolean;
  isLoading: boolean;
}

export type FeatureFlagsContextValue = {
  [key in FeatureFlag]?: FeatureFlagValue;
};
