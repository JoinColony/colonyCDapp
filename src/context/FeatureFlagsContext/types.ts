export enum FeatureFlag {
  CRYPTO_TO_FIAT = 'CRYPTO_TO_FIAT',
}

export interface FeatureFlagValue {
  isEnabled: boolean;
  isLoading: boolean;
}

export type FeatureFlagsContextValue = {
  [key in FeatureFlag]?: FeatureFlagValue;
};
