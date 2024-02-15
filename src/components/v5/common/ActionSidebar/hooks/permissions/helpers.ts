import { ColonyRole, Id } from '@colony/colony-js';

import { Action } from '~constants/actions.ts';
import { getAllUserRoles } from '~transformers/index.ts';
import { type Colony } from '~types/graphql.ts';
import { type Address } from '~types/index.ts';
import { addressHasRoles } from '~utils/checks/index.ts';

export const getPermissionsNeededForAction = (
  actionType: Action,
  formValues: Record<string, any>,
): ColonyRole[] | undefined => {
  switch (actionType) {
    case Action.SIMPLE_PAYMENT:
      return [ColonyRole.Funding, ColonyRole.Administration];
    case Action.MINT_TOKENS:
      return [ColonyRole.Root];
    case Action.TRANSFER_FUNDS:
      return [ColonyRole.Funding];
    case Action.UNLOCK_TOKEN:
      return [ColonyRole.Root];
    case Action.MANAGE_TOKENS:
      return [ColonyRole.Root];
    case Action.CREATE_NEW_TEAM:
      return [ColonyRole.Architecture];
    case Action.EDIT_EXISTING_TEAM:
      return [ColonyRole.Architecture];
    case Action.MANAGE_REPUTATION:
      /**
       * @TODO: Once this action is wired, we'll need to tell if
       * it's a smite or award action (most likely from `formValues`)
       * If smite: Arbitration, else: Root
       */
      return undefined;
    case Action.MANAGE_PERMISSIONS: {
      return formValues.team === Id.RootDomain
        ? [ColonyRole.Root, ColonyRole.Architecture]
        : [ColonyRole.Architecture];
    }
    case Action.EDIT_COLONY_DETAILS:
    case Action.MANAGE_COLONY_OBJECTIVES:
      return [ColonyRole.Root];
    case Action.UPGRADE_COLONY_VERSION:
      return [ColonyRole.Root];
    case Action.ENTER_RECOVERY_MODE:
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
    case Action.SIMPLE_PAYMENT:
    case Action.TRANSFER_FUNDS:
      return formValues.from;
    case Action.MANAGE_REPUTATION:
    case Action.MANAGE_PERMISSIONS:
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
