import { type ColonyRole, Id } from '@colony/colony-js';

import { Action, PERMISSIONS_NEEDED_FOR_ACTION } from '~constants/actions.ts';
import { getAllUserRoles } from '~transformers/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { type Colony } from '~types/graphql.ts';
import { type Address } from '~types/index.ts';
import { addressHasRoles } from '~utils/checks/index.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { ModificationOption } from '~v5/common/ActionSidebar/partials/forms/ManageReputationForm/consts.ts';

export const getPermissionsNeededForAction = (
  actionType: Action,
  formValues: Record<string, any>,
): ColonyRole[][] | undefined => {
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
      return [
        ...PERMISSIONS_NEEDED_FOR_ACTION.ManageReputationAward,
        ...PERMISSIONS_NEEDED_FOR_ACTION.ManageReputationRemove,
      ];
    case Action.ManagePermissions: {
      const { decisionMethod, createdIn, team } = formValues;

      const isMotion = decisionMethod === DecisionMethod.Reputation;

      let createdInDomain;
      if (!isMotion) {
        createdInDomain = team;
      } else if (team) {
        createdInDomain = createdIn;
      } else {
        createdInDomain = undefined;
      }

      if (createdInDomain === undefined) {
        return PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInSubDomain;
      }

      const createdInRoot = createdInDomain === Id.RootDomain;

      if (decisionMethod === DecisionMethod.MultiSig) {
        if (createdInDomain === undefined) {
          return [
            ...PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInRootDomain,
            ...PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInSubDomainViaMultiSig,
          ];
        }
        return createdInRoot
          ? PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInRootDomain
          : PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInSubDomainViaMultiSig;
      }

      if (createdInDomain === undefined) {
        return [
          ...PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInRootDomain,
          ...PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInSubDomain,
        ];
      }

      return createdInRoot
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
    case Action.SplitPayment: {
      return PERMISSIONS_NEEDED_FOR_ACTION.SplitPayment;
    }
    case Action.StagedPayment: {
      return PERMISSIONS_NEEDED_FOR_ACTION.StagedPayment;
    }
    case Action.ArbitraryTxs: {
      return PERMISSIONS_NEEDED_FOR_ACTION.ArbitraryTxs;
    }
    case Action.StreamingPayment:
      return PERMISSIONS_NEEDED_FOR_ACTION.StreamingPayment;

    default:
      return undefined;
  }
};

// Function returning the domain ID in which the user needs to have required permissions to create the action
export const getPermissionsDomainIdForAction = (
  actionType: Action,
  formValues: Record<string, any>,
) => {
  const { decisionMethod, createdIn, team, from } = formValues;
  const isMotion =
    decisionMethod && decisionMethod !== DecisionMethod.Permissions;

  switch (actionType) {
    case Action.SimplePayment:
    case Action.PaymentBuilder:
    case Action.StagedPayment:
      if (!isMotion) {
        return from;
      }
      if (from !== undefined) {
        return createdIn;
      }
      return undefined;
    case Action.ManageReputation:
    case Action.EditExistingTeam:
    case Action.SplitPayment:
      if (!isMotion) {
        return team;
      }
      if (team !== undefined) {
        return createdIn;
      }
      return undefined;
    // @TODO this should return the parent domain when nested domains are a thing
    case Action.ManagePermissions:
      if (!team) {
        return undefined;
      }
      return Id.RootDomain;
    default:
      if (!isMotion) {
        return Id.RootDomain;
      }
      return createdIn;
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

  if (!requiredRoles) {
    return undefined;
  }

  const hasPermissions = addressHasRoles({
    requiredRoles,
    requiredRolesDomain: relevantDomainId,
    colony,
    address: userAddress,
    isMultiSig,
  });

  return hasPermissions;
};
