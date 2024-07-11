import { useFeatureFlagPayload } from 'posthog-js/react';
import { useEffect, useState } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';

import { type FeatureFlag } from './FeatureFlagsContext.ts';

interface FeatureFlagPayload {
  isEnabled: true;
  whitelistedUsers?: string[];
  blacklistedUsers?: string[];
}

// Type guard function
function isFeatureFlagPayload(value): value is FeatureFlagPayload {
  if (typeof value !== 'object' || value === null) return false;

  const hasIsEnabled =
    'isEnabled' in value && typeof value.isEnabled === 'boolean';
  const hasWhitelistedUsers =
    !('whitelistedUsers' in value) || Array.isArray(value.whitelistedUsers);
  const hasBlacklistedUsers =
    !('blacklistedUsers' in value) || Array.isArray(value.blacklistedUsers);

  return hasIsEnabled && hasWhitelistedUsers && hasBlacklistedUsers;
}

export const useFeatureFlag = (featureFlagName: FeatureFlag) => {
  const featureFlagPayload = useFeatureFlagPayload(featureFlagName);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const { wallet } = useAppContext();

  useEffect(() => {
    if (!featureFlagPayload || !wallet?.address) {
      return;
    }
    setLoading(false);

    if (!isFeatureFlagPayload(featureFlagPayload)) {
      console.warn('Invalid feature flag payload', featureFlagPayload);
      return;
    }

    const { isEnabled, whitelistedUsers, blacklistedUsers } =
      featureFlagPayload;
    if (isEnabled && blacklistedUsers?.includes(wallet.address)) {
      setEnabled(false);
      return;
    }

    if (!isEnabled && whitelistedUsers?.includes(wallet.address)) {
      setEnabled(true);
      return;
    }

    setEnabled(isEnabled);
  }, [featureFlagPayload, wallet?.address]);

  return {
    isEnabled: enabled,
    isLoading: loading,
  };
};
