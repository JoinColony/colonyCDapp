import { ColonyRole } from '@colony/colony-js';
import { ColonyActionType } from '~gql';
import { useAppContext, useColonyContext } from '~hooks';
import { addressHasRoles } from '~utils/checks';

const permissionsByActionType = {
  [ColonyActionType.CreateDomain]: [ColonyRole.Architecture],
};

export const useUserHasPermissions = (
  actionType: ColonyActionType,
  domainId: number,
): boolean => {
  const { colony } = useColonyContext();
  const { wallet } = useAppContext();

  const requiredRoles = permissionsByActionType[actionType];
  if (!requiredRoles) {
    return false;
  }

  const hasRoles = addressHasRoles({
    requiredRoles,
    requiredRolesDomains: [domainId],
    colony,
    address: wallet?.address ?? '',
  });

  return hasRoles;
};
