import { Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { Action } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { getAllUserRoles, getUserRolesForDomain } from '~transformers';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';

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
    colony,
    userAddress: user.walletAddress,
    domainId: Id.RootDomain,
  });

  const userRootMultiSigRoles = getUserRolesForDomain(
    colony,
    user.walletAddress,
    Id.RootDomain,
    false,
    true,
  );

  const userRoles = getAllUserRoles(colony, user.walletAddress);

  const userMultiSigRoles = getAllUserRoles(colony, user.walletAddress, true);

  if (
    !requiredPermissions.every((role) => {
      // If the requiredRolesDomain is root, check the user has the required permissions in root
      if (requiredRolesDomain === Id.RootDomain) {
        return (
          userRootRoles.includes(role) ||
          // If multiSig is enabled, check if the user has the required multiSig permissions in root
          (isMultiSigEnabled && userRootMultiSigRoles.includes(role))
        );
      }
      // Otherwise, check the user has the required permissions in any domain
      return (
        userRoles.includes(role) ||
        // If multiSig is enabled, check if the user has the required multiSig permissions
        (isMultiSigEnabled && userMultiSigRoles.includes(role))
      );
    })
  ) {
    return true;
  }

  return false;
};

export default useHasNoDecisionMethods;
