import { useFormContext } from 'react-hook-form';

import { Action } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { getAllUserRoles } from '~transformers';

import { ACTION_TYPE_FIELD_NAME } from '../../consts.ts';

import { getPermissionsNeededForAction } from './helpers.ts';

/**
 * Hook determining if the user has no decision methods available for the currently selected action type
 */
const useHasNoDecisionMethods = () => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();

  const { watch } = useFormContext();
  const actionType = watch(ACTION_TYPE_FIELD_NAME);

  if (!user) {
    return true;
  }

  // User can't use reputation to create Payment builder action
  if (isVotingReputationEnabled && actionType !== Action.PaymentBuilder) {
    return false;
  }

  const requiredPermissions = getPermissionsNeededForAction(actionType, {});
  if (!requiredPermissions) {
    return false;
  }

  // Check if the user has the required permissions in any domain
  const userRoles = getAllUserRoles(colony, user.walletAddress);
  if (!requiredPermissions.every((role) => userRoles.includes(role))) {
    return true;
  }

  return false;
};

export default useHasNoDecisionMethods;
