import { useFeatureFlagPayload } from 'posthog-js/react';
import { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';

import { type ColonyFeatureFlag } from './ColonyFeatureFlagsContext.ts';

interface FeatureFlagPayload {
  isEnabled: true;
  whitelistedColonies?: string[];
  blacklistedColonies?: string[];
}

// Type guard function
function isFeatureFlagPayload(value): value is FeatureFlagPayload {
  if (typeof value !== 'object' || value === null) return false;

  const hasIsEnabled =
    'isEnabled' in value && typeof value.isEnabled === 'boolean';
  const hasWhitelistedColonies =
    !('whitelistedColonies' in value) ||
    Array.isArray(value.whitelistedColonies);
  const hasBlacklistedColonies =
    !('blacklistedColonies' in value) ||
    Array.isArray(value.blacklistedColonies);

  return hasIsEnabled && hasWhitelistedColonies && hasBlacklistedColonies;
}

export const useColonyFeatureFlag = (featureFlagName: ColonyFeatureFlag) => {
  const payload = useFeatureFlagPayload(featureFlagName);
  const { colony } = useColonyContext();

  const isFeatureEnabled = useMemo(() => {
    if (!isFeatureFlagPayload(payload)) {
      // Handle the case where the payload does not match the expected structure
      console.warn('Invalid feature flag payload', payload);
      return false;
    }

    const { isEnabled, whitelistedColonies, blacklistedColonies } = payload;

    if (isEnabled && blacklistedColonies?.includes(colony.name)) {
      return false;
    }

    if (!isEnabled && whitelistedColonies?.includes(colony.name)) {
      return true;
    }

    return isEnabled;
  }, [payload, colony]);

  return isFeatureEnabled;
};
