import { useFeatureFlagEnabled } from 'posthog-js/react';

import { type FeatureFlag, type FeatureFlagValue } from './types.ts';

export const useFeatureFlag = (
  featureFlagName: FeatureFlag,
): FeatureFlagValue => {
  const isEnabled = useFeatureFlagEnabled(featureFlagName);

  return { isEnabled: isEnabled ?? false, isLoading: isEnabled === undefined };
};
