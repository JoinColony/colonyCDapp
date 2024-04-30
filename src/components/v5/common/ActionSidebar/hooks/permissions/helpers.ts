import { ColonyRole, Id } from '@colony/colony-js';

import { Action } from '~constants/actions.ts';
import { getAllUserRoles } from '~transformers/index.ts';
import { type Colony } from '~types/graphql.ts';
import { type Address } from '~types/index.ts';
import { addressHasRoles } from '~utils/checks/index.ts';

import { ModificationOption } from '../../partials/forms/ManageReputationForm/consts.ts';

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
      if (!formValues.modification) {
        return [ColonyRole.Arbitration];
      }
      return formValues.modification === ModificationOption.RemoveReputation
        ? [ColonyRole.Arbitration]
        : [ColonyRole.Root];
    case Action.ManagePermissions: {
      return formValues.team === Id.RootDomain
        ? [ColonyRole.Root, ColonyRole.Architecture]
        : [ColonyRole.Architecture];
    }
    case Action.ManageVerifiedMembers: {
      return [ColonyRole.Administration];
    }
    case Action.EditColonyDetails:
    case Action.ManageColonyObjectives:
      return [ColonyRole.Root];
    case Action.UpgradeColonyVersion:
      return [ColonyRole.Root];
    case Action.EnterRecoveryMode:
      return [ColonyRole.Recovery];
    case Action.PaymentBuilder:
      return [ColonyRole.Administration];
    default:
      return undefined;
  }
};

// Function returning the domain ID in which the user needs to have required permissions to create the action
export const getPermissionsDomainIdForAction = (
  actionType: Action,
  formValues: Record<string, any>,
) => {
  switch (actionType) {
    case Action.SimplePayment:
    case Action.TransferFunds:
    case Action.PaymentBuilder:
      return formValues.from;
    case Action.ManageReputation:
    case Action.ManagePermissions:
      return formValues.team;
    default:
      return Id.RootDomain;
  }
};

export const getHasActionPermissions = ({
  colony,
  userAddress,
  actionType,
  formValues,
  isMultiSig = false,
}: {
  colony: Colony;
  userAddress: Address;
  actionType: Action;
  formValues: Record<string, any>;
  isMultiSig?: boolean;
}) => {
  const allUserRoles = getAllUserRoles(colony, userAddress, isMultiSig);
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
    isMultiSig,
  });

  return hasPermissions;
};
