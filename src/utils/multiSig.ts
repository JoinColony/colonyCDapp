import { type ColonyRole } from '@colony/colony-js';

import { PERMISSIONS_NEEDED_FOR_ACTION } from '~constants/actions.ts';
import { ColonyActionType, type ColonyActionFragment } from '~gql';
import { type ColonyAction } from '~types/graphql.ts';
import { type MultiSigAction } from '~types/motions.ts';

import { MotionState } from './colonyMotions.ts';

export const getRolesNeededForMultiSigAction = (
  actionType: ColonyActionType,
): ColonyRole[] | undefined => {
  switch (actionType) {
    case ColonyActionType.CreateDomainMultisig:
      return PERMISSIONS_NEEDED_FOR_ACTION.CreateNewTeam;
    case ColonyActionType.EditDomainMultisig:
      return PERMISSIONS_NEEDED_FOR_ACTION.EditExistingTeam;
    case ColonyActionType.MintTokensMultisig:
      return PERMISSIONS_NEEDED_FOR_ACTION.MintTokens;
    case ColonyActionType.UnlockTokenMultisig:
      return PERMISSIONS_NEEDED_FOR_ACTION.UnlockToken;
    case ColonyActionType.AddVerifiedMembersMultisig:
    case ColonyActionType.RemoveVerifiedMembersMultisig:
      return PERMISSIONS_NEEDED_FOR_ACTION.ManageVerifiedMembers;
    default:
      return undefined;
  }
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

export function isMultiSig(action: ColonyAction): action is MultiSigAction {
  return !!action.multiSigData && !!action.multiSigId;
}
