import { Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { Action } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { getAllUserRoles, getUserRolesForDomain } from '~transformers';
import { extractColonyRoles } from '~utils/colonyRoles.ts';

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
  const { isVotingReputationEnabled, isMultiSigEnabled } =
    useEnabledExtensions();

  const { watch } = useFormContext() || {};

  if (!watch) {
    return false;
  }

  const actionType = watch(ACTION_TYPE_FIELD_NAME);

  if (!user) {
    return true;
  }

  if (!isVotingReputationEnabled && actionType === Action.CreateDecision) {
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

  const requiredRolesDomain = getPermissionsDomainIdForAction(actionType, {});

  const userRootRoles = getUserRolesForDomain({
    colonyRoles: extractColonyRoles(colony.roles),
    userAddress: user.walletAddress,
    domainId: Id.RootDomain,
  });

  const userRootMultiSigRoles = getUserRolesForDomain({
    colonyRoles: extractColonyRoles(colony.roles),
    userAddress: user.walletAddress,
    domainId: Id.RootDomain,
    excludeInherited: false,
    isMultiSig: true,
  });

  const userRoles = getAllUserRoles(
    extractColonyRoles(colony.roles),
    user.walletAddress,
  );

  const userMultiSigRoles = getAllUserRoles(
    extractColonyRoles(colony.roles),
    user.walletAddress,
    true,
  );

  if (
    !requiredPermissions.some((roles) => {
      // Check if every role in the current sub-array is satisfied
      return roles.every((role) => {
        // Determine the roles to check based on the domain
        const rolesToCheck =
          requiredRolesDomain === Id.RootDomain
            ? {
                userRoles: userRootRoles,
                userMultiSigRoles: isMultiSigEnabled
                  ? userRootMultiSigRoles
                  : [],
              }
            : {
                userRoles,
                userMultiSigRoles: isMultiSigEnabled ? userMultiSigRoles : [],
              };

        // Check if the user has the role in any domain
        return (
          rolesToCheck.userRoles.includes(role) ||
          (isMultiSigEnabled && rolesToCheck.userMultiSigRoles.includes(role))
        );
      });
    })
  ) {
    return true;
  }

  return false;
};

export default useHasNoDecisionMethods;
