import { type ColonyRole, Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { Action } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { getAllUserRoles, getUserRolesForDomain } from '~transformers';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';

import {
  actionsWithStakingDecisionMethod,
  actionsWithoutMultiSigDecisionMethod,
  actionsWithoutReputationDecisionMethod,
} from './consts.ts';
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
  const {
    isVotingReputationEnabled,
    isMultiSigEnabled,
    isStakedExpenditureEnabled,
  } = useEnabledExtensions();

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

  // User can't use reputation to create certain actions
  if (
    isVotingReputationEnabled &&
    !actionsWithoutReputationDecisionMethod.includes(actionType)
  ) {
    return false;
  }

  if (
    isStakedExpenditureEnabled &&
    actionsWithStakingDecisionMethod.includes(actionType)
  ) {
    return false;
  }

  const requiredPermissions = getPermissionsNeededForAction(actionType, {});
  if (!requiredPermissions) {
    return false;
  }

  const actionSupportsMultisig =
    !actionsWithoutMultiSigDecisionMethod.includes(actionType);

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
        let rolesToCheck: {
          userRoles: ColonyRole[];
          userMultiSigRoles: ColonyRole[];
        };

        if (!requiredRolesDomain) {
          rolesToCheck = {
            userRoles: [...userRootRoles, ...userRoles],
            userMultiSigRoles: isMultiSigEnabled
              ? [...userRootMultiSigRoles, ...userMultiSigRoles]
              : [],
          };
        } else if (requiredRolesDomain === Id.RootDomain) {
          rolesToCheck = {
            userRoles: userRootRoles,
            userMultiSigRoles: isMultiSigEnabled ? userRootMultiSigRoles : [],
          };
        } else {
          rolesToCheck = {
            userRoles,
            userMultiSigRoles: isMultiSigEnabled ? userMultiSigRoles : [],
          };
        }

        // Check if the user has the role or multisig role in any domain
        // @TODO: If an action requires multiple permissions (Simple Payment) then all the roles need to be in the same domain
        // This would require reworking `userRoles` and `userMultiSigRoles` to group roles by domain
        const userHasRole = rolesToCheck.userRoles.includes(role);
        const userHasMultiSigRole =
          isMultiSigEnabled &&
          actionSupportsMultisig &&
          rolesToCheck.userMultiSigRoles.includes(role);

        return userHasRole || userHasMultiSigRole;
      });
    })
  ) {
    return true;
  }

  return false;
};

export default useHasNoDecisionMethods;
