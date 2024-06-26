import { useFeatureFlagPayload } from 'posthog-js/react';

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
  const payload = useFeatureFlagPayload(featureFlagName);
  const { wallet } = useAppContext();

  if (!wallet?.address) {
    return false;
  }

  if (!isFeatureFlagPayload(payload)) {
    // Handle the case where the payload does not match the expected structure
    console.warn('Invalid feature flag payload', payload);
    return false;
  }

  const { isEnabled, whitelistedUsers, blacklistedUsers } = payload;
  if (isEnabled && blacklistedUsers?.includes(wallet?.address)) {
    return false;
  }

  if (!isEnabled && whitelistedUsers?.includes(wallet?.address)) {
    return true;
  }

  return isEnabled;
};
