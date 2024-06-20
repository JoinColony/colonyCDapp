import { type Action } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { addressHasRoles } from '~utils/checks/index.ts';
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

  return addressHasRoles({
    colony,
    address: user.walletAddress,
    requiredRoles: requiredPermissions,
    requiredRolesDomain,
  });
};
