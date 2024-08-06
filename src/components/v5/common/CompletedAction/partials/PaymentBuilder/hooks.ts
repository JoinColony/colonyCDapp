import { Id } from '@colony/colony-js';

import { type Action } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { getAllUserRoles, getUserRolesForDomain } from '~transformers';
import {
  getPermissionsDomainIdForAction,
  getPermissionsNeededForAction,
} from '~v5/common/ActionSidebar/hooks/permissions/helpers.ts';

export const useCheckIfUserHasPermissions = (actionType: Action) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  if (!user) {
    return false;
  }

  const requiredPermissions = getPermissionsNeededForAction(actionType, {});
  if (!requiredPermissions) {
    return true;
  }

  const requiredRolesDomain = getPermissionsDomainIdForAction(actionType, {});

  const userRootRoles = getUserRolesForDomain({
    colony,
    userAddress: user.walletAddress,
    domainId: Id.RootDomain,
  });

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
    return false;
  }

  return true;
};
