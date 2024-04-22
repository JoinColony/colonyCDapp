import { Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { Action } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.tsx';
import { getAllUserRoles, getUserRolesForDomain } from '~transformers';

import { ACTION_TYPE_FIELD_NAME } from '../../consts.ts';

import {
  getPermissionsDomainIdForAction,
  getPermissionsNeededForAction,
} from './helpers.ts';

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

  const requiredRolesDomain = getPermissionsDomainIdForAction(actionType, {});

  const userRootRoles = getUserRolesForDomain(
    colony,
    user.walletAddress,
    Id.RootDomain,
  );

  const userRoles = getAllUserRoles(colony, user.walletAddress);

  if (
    !requiredPermissions.every((role) => {
      // If the requiredRolesDomain is root, check the user has the required permissions in root
      if (requiredRolesDomain === Id.RootDomain) {
        return userRootRoles.includes(role);
      }
      // Otherwise, check the user has the required permissions in any domain
      return userRoles.includes(role);
    })
  ) {
    return true;
  }

  return false;
};

export default useHasNoDecisionMethods;
