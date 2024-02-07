import { ColonyRole, Id } from '@colony/colony-js';

import { ACTION, type Action } from '~constants/actions.ts';
import { getAllUserRoles } from '~transformers/index.ts';
import { type Colony } from '~types/graphql.ts';
import { type Address } from '~types/index.ts';
import { addressHasRoles } from '~utils/checks/index.ts';

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
      if (!formValues.team) {
        return undefined;
      }
      return formValues.team === Id.RootDomain
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

// Function returning the domain ID in which the user needs to have required permissions to create the action
const getPermissionsDomainIdForAction = (
  actionType: Action,
  formValues: Record<string, any>,
) => {
  switch (actionType) {
    case ACTION.SIMPLE_PAYMENT:
    case ACTION.TRANSFER_FUNDS:
      return formValues.from;
    case ACTION.MANAGE_REPUTATION:
    case ACTION.MANAGE_PERMISSIONS:
      return formValues.team;
    default:
      return Id.RootDomain;
  }
};

export const getHasActionPermissions = (
  colony: Colony,
  userAddress: Address,
  actionType: Action,
  formValues: Record<string, any>,
) => {
  const allUserRoles = getAllUserRoles(colony, userAddress);
  if (allUserRoles.length === 0) {
    return false;
  }

  const requiredRoles = getPermissionsNeededForAction(actionType, formValues);
  const relevantDomainId = getPermissionsDomainIdForAction(
    actionType,
    formValues,
  );

  if (!requiredRoles || !relevantDomainId) {
    return undefined;
  }

  const hasPermissions = addressHasRoles({
    requiredRoles,
    requiredRolesDomains: [relevantDomainId],
    colony,
    address: userAddress,
  });

  return hasPermissions;
};
