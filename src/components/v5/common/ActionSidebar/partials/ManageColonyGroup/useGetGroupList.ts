import { Action } from '~constants/actions.ts';
import { useFeatureFlagsContext } from '~context/FeatureFlagsContext/FeatureFlagsContext.ts';

import {
  GROUP_ADMIN_LIST,
  GROUP_FUNDS_LIST,
  GROUP_TEAMS_LIST,
} from './GroupList.ts';

export const useGetGroupAdminList = () => {
  const featureFlags = useFeatureFlagsContext();
  const isFeatureFlagSupportedChainsEnabled =
    featureFlags.SUPPORTED_CHAINS_ACTION?.isLoading ||
    featureFlags.SUPPORTED_CHAINS_ACTION?.isEnabled;
  let groupListTransformed = [...GROUP_ADMIN_LIST];
  if (!isFeatureFlagSupportedChainsEnabled) {
    groupListTransformed = groupListTransformed.map(({ action, ...rest }) => {
      return {
        ...rest,
        action,
        isHidden: action === Action.ManageSupportedChains,
      };
    });
  }
  return groupListTransformed;
};
export const useGetGroupFundsList = () => {
  // Add logic here to show / hide actions where necessary
  return GROUP_FUNDS_LIST;
};
export const useGetGroupTeamsList = () => {
  // Add logic here to show / hide actions where necessary
  return GROUP_TEAMS_LIST;
};
