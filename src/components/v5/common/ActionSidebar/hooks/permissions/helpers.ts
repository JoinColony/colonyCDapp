import { type ColonyRole, Id } from '@colony/colony-js';

import { Action, PERMISSIONS_NEEDED_FOR_ACTION } from '~constants/actions.ts';
import { getAllUserRoles } from '~transformers/index.ts';
import { type Colony } from '~types/graphql.ts';
import { type Address } from '~types/index.ts';
import { addressHasRoles } from '~utils/checks/index.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';

import { ModificationOption } from '../../partials/forms/ManageReputationForm/consts.ts';

export const getPermissionsNeededForAction = (
  actionType: Action,
  formValues: Record<string, any>,
): ColonyRole[] | undefined => {
  switch (actionType) {
    case Action.SimplePayment:
      return PERMISSIONS_NEEDED_FOR_ACTION.SimplePayment;
    case Action.MintTokens:
      return PERMISSIONS_NEEDED_FOR_ACTION.MintTokens;
    case Action.TransferFunds:
      return PERMISSIONS_NEEDED_FOR_ACTION.TransferFunds;
    case Action.UnlockToken:
      return PERMISSIONS_NEEDED_FOR_ACTION.UnlockToken;
    case Action.ManageTokens:
      return PERMISSIONS_NEEDED_FOR_ACTION.ManageTokens;
    case Action.CreateNewTeam:
      return PERMISSIONS_NEEDED_FOR_ACTION.CreateNewTeam;
    case Action.EditExistingTeam:
      return PERMISSIONS_NEEDED_FOR_ACTION.EditExistingTeam;
    case Action.ManageReputation:
      if (formValues.modification === ModificationOption.AwardReputation) {
        return PERMISSIONS_NEEDED_FOR_ACTION.ManageReputationAward;
      }
      if (formValues.modification === ModificationOption.RemoveReputation) {
        return PERMISSIONS_NEEDED_FOR_ACTION.ManageReputationRemove;
      }
      return undefined;
    case Action.ManagePermissions: {
      return formValues.team === Id.RootDomain
        ? PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInRootDomain
        : PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInSubDomain;
    }
    case Action.ManageVerifiedMembers: {
      return PERMISSIONS_NEEDED_FOR_ACTION.ManageVerifiedMembers;
    }
    case Action.EditColonyDetails: {
      return PERMISSIONS_NEEDED_FOR_ACTION.EditColonyDetails;
    }
    case Action.ManageColonyObjectives: {
      return PERMISSIONS_NEEDED_FOR_ACTION.ManageColonyObjective;
    }
    case Action.UpgradeColonyVersion: {
      return PERMISSIONS_NEEDED_FOR_ACTION.UpgradeColonyVersion;
    }
    case Action.EnterRecoveryMode: {
      return PERMISSIONS_NEEDED_FOR_ACTION.EnterRecoveryMode;
    }
    case Action.PaymentBuilder: {
      return PERMISSIONS_NEEDED_FOR_ACTION.PaymentBuilder;
    }
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
  const allUserRoles = getAllUserRoles(
    extractColonyRoles(colony.roles),
    userAddress,
    isMultiSig,
  );
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
