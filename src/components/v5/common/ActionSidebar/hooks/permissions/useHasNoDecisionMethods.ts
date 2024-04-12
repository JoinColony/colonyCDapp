import { useFormContext } from 'react-hook-form';

import { Action } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.tsx';
import { getAllUserRoles, getUserRolesForDomain } from '~transformers';

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

  if (!isVotingReputationEnabled && actionType === Action.CreateDecision) {
    return true;
  }

  if (isVotingReputationEnabled) {
    return false;
  }

  const requiredPermissions = getPermissionsNeededForAction(actionType, {});
  if (!requiredPermissions) {
    return false;
  }

  // Check if the user has the required permissions in root domain
  // for action types which can only be actioned in root domain
  const userRootRoles = getUserRolesForDomain(colony, user.walletAddress, 1);
  if (!requiredPermissions.every((role) => userRootRoles.includes(role))) {
    if (actionType === Action.ManageVerifiedMembers) {
      return true;
    }
  }

  // Check if the user has the required permissions in any domain
  const userRoles = getAllUserRoles(colony, user.walletAddress);
  if (!requiredPermissions.every((role) => userRoles.includes(role))) {
    return true;
  }

  return false;
};

export default useHasNoDecisionMethods;
