import { useFormContext } from 'react-hook-form';

import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import useEnabledExtensions from '~hooks/useEnabledExtensions.tsx';

import { ACTION_TYPE_FIELD_NAME } from '../../consts.tsx';

import { getHasActionPermissions } from './helpers.ts';

/**
 * Hook determining if the user has no decision methods available for the currently selected action type
 */
export const useHasNoDecisionMethods = () => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();

  const { watch } = useFormContext();
  const actionType = watch(ACTION_TYPE_FIELD_NAME);

  if (!user) {
    return true;
  }

  if (isVotingReputationEnabled) {
    return false;
  }

  const hasPermissions = getHasActionPermissions(
    colony,
    user?.walletAddress ?? '',
    actionType,
    {},
  );

  if (hasPermissions === false) {
    return true;
  }

  return false;
};
