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
    case Action.SimplePayment:
      return [ColonyRole.Funding, ColonyRole.Administration];
    case Action.MintTokens:
      return [ColonyRole.Root];
    case Action.TransferFunds:
      return [ColonyRole.Funding];
    case Action.UnlockToken:
      return [ColonyRole.Root];
    case Action.ManageTokens:
      return [ColonyRole.Root];
    case Action.CreateNewTeam:
      return [ColonyRole.Architecture];
    case Action.EditExistingTeam:
      return [ColonyRole.Architecture];
    case Action.ManageReputation:
      /**
       * @TODO: Once this action is wired, we'll need to tell if
       * it's a smite or award action (most likely from `formValues`)
       * If smite: Arbitration, else: Root
       */
      return undefined;
    case Action.ManagePermissions: {
      return formValues.team === Id.RootDomain
        ? [ColonyRole.Root, ColonyRole.Architecture]
        : [ColonyRole.Architecture];
    }
    case Action.EditColonyDetails:
    case Action.ManageColonyObjectives:
      return [ColonyRole.Root];
    case Action.UpgradeColonyVersion:
      return [ColonyRole.Root];
    case Action.EnterRecoveryMode:
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
    case Action.SimplePayment:
    case Action.TransferFunds:
      return formValues.from;
    case Action.ManageReputation:
    case Action.ManagePermissions:
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
