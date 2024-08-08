import { Id, type ColonyRole } from '@colony/colony-js';

import { PERMISSIONS_NEEDED_FOR_ACTION } from '~constants/actions.ts';
import { ColonyActionType, type ColonyActionFragment } from '~gql';
import { type Colony, type ColonyAction } from '~types/graphql.ts';
import { type MultiSigAction } from '~types/motions.ts';

import { MotionState } from './colonyMotions.ts';
import { extractColonyRoles } from './colonyRoles.ts';
import { extractColonyDomains } from './domains.ts';

export const getRolesNeededForMultiSigAction = ({
  actionType,
  createdIn,
}: {
  actionType: ColonyActionType;
  createdIn: number;
}): ColonyRole[][] | undefined => {
  let permissions: ColonyRole[][] | undefined;

  switch (actionType) {
    case ColonyActionType.ColonyEditMultisig:
      permissions = PERMISSIONS_NEEDED_FOR_ACTION.EditColonyDetails;
      break;
    case ColonyActionType.CreateDomainMultisig:
      permissions = PERMISSIONS_NEEDED_FOR_ACTION.CreateNewTeam;
      break;
    case ColonyActionType.EditDomainMultisig:
      permissions = PERMISSIONS_NEEDED_FOR_ACTION.EditExistingTeam;
      break;
    case ColonyActionType.EmitDomainReputationRewardMultisig:
      permissions = PERMISSIONS_NEEDED_FOR_ACTION.ManageReputationAward;
      break;
    case ColonyActionType.EmitDomainReputationPenaltyMultisig:
      permissions = PERMISSIONS_NEEDED_FOR_ACTION.ManageReputationRemove;
      break;
    case ColonyActionType.MintTokensMultisig:
      permissions = PERMISSIONS_NEEDED_FOR_ACTION.MintTokens;
      break;
    case ColonyActionType.UnlockTokenMultisig:
      permissions = PERMISSIONS_NEEDED_FOR_ACTION.UnlockToken;
      break;
    case ColonyActionType.AddVerifiedMembersMultisig:
    case ColonyActionType.RemoveVerifiedMembersMultisig:
      permissions = PERMISSIONS_NEEDED_FOR_ACTION.ManageVerifiedMembers;
      break;
    case ColonyActionType.MoveFundsMultisig:
      permissions = PERMISSIONS_NEEDED_FOR_ACTION.TransferFunds;
      break;
    case ColonyActionType.SetUserRolesMultisig:
      if (!createdIn) {
        permissions = undefined;
        break;
      }
      if (createdIn === Id.RootDomain) {
        permissions =
          PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInRootDomain;
        break;
      }
      permissions =
        PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInSubDomainViaMultiSig;
      break;
    case ColonyActionType.PaymentMultisig:
      permissions = PERMISSIONS_NEEDED_FOR_ACTION.SimplePayment;
      break;
    default:
      permissions = undefined;
      break;
  }

  if (!permissions) {
    return undefined;
  }

  if (permissions.length > 1) {
    console.warn(
      'The Multi-Sig voting UI does not support actions which can be voted on by different sets of roles',
    );
    return undefined;
  }

  return permissions;
};

export const getMultiSigState = (
  multiSigData: ColonyActionFragment['multiSigData'],
) => {
  if (!multiSigData) {
    return MotionState.Invalid;
  }

  if (multiSigData.isRejected) {
    return MotionState.Rejected;
  }

  if (multiSigData.isExecuted) {
    return MotionState.Passed;
  }

  return MotionState.Open;
};

export const getMultiSigPayload = (
  isMultiSigFlag: boolean,
  colony: Colony,
) => ({
  colonyRoles: extractColonyRoles(colony.roles),
  colonyDomains: extractColonyDomains(colony.domains),
  isMultiSig: isMultiSigFlag,
});

export function isMultiSig(action: ColonyAction): action is MultiSigAction {
  return !!action.multiSigData && !!action.multiSigId;
}
