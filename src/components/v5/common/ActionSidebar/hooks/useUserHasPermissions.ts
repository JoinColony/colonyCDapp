import { ColonyRole, Id } from '@colony/colony-js';
import { useWatch } from 'react-hook-form';

import { Action, ACTION } from '~constants/actions';
import { useAppContext, useColonyContext } from '~hooks';
import { addressHasRoles } from '~utils/checks';

const getPermissionsNeededForAction = (
  actionType: Action,
  formValues: Record<string, any>,
): ColonyRole[] | undefined => {
  switch (actionType) {
    case ACTION.SIMPLE_PAYMENT:
      return [ColonyRole.Funding, ColonyRole.Administration];
    case ACTION.MINT_TOKENS:
      return [ColonyRole.Root];
    case ACTION.TRANSFER_FUNDS:
      return [ColonyRole.Funding];
    case ACTION.UNLOCK_TOKEN:
      return [ColonyRole.Root];
    case ACTION.MANAGE_TOKENS:
      return [ColonyRole.Root];
    case ACTION.CREATE_NEW_TEAM:
      return [ColonyRole.Architecture];
    case ACTION.EDIT_EXISTING_TEAM:
      return [ColonyRole.Architecture];
    case ACTION.MANAGE_REPUTATION:
      /**
       * @TODO: Once this action is wired, we'll need to tell if
       * it's a smite or award action (most likely from `formValues`)
       * If smite: Arbitration, else: Root
       */
      return undefined;
    case ACTION.MANAGE_PERMISSIONS: {
      const domainId = Number(formValues.team);
      if (!domainId) {
        return undefined;
      }
      return domainId === Id.RootDomain
        ? [ColonyRole.Root, ColonyRole.Architecture]
        : [ColonyRole.Architecture];
    }
    case ACTION.EDIT_COLONY_DETAILS:
    case ACTION.MANAGE_COLONY_OBJECTIVES:
      return [ColonyRole.Root];
    case ACTION.UPGRADE_COLONY_VERSION:
      return [ColonyRole.Root];
    case ACTION.ENTER_RECOVERY_MODE:
      return [ColonyRole.Recovery];
    default:
      return undefined;
  }
};

export const useUserHasPermissions = (
  actionType: Action,
  domainId: number,
): boolean => {
  const { colony } = useColonyContext();
  const { wallet } = useAppContext();
  const formValues = useWatch();

  const requiredRoles = getPermissionsNeededForAction(actionType, formValues);
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
