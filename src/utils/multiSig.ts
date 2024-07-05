import { type ColonyRole } from '@colony/colony-js';

import { PERMISSIONS_NEEDED_FOR_ACTION } from '~constants/actions.ts';
import { ColonyActionType, type ColonyActionFragment } from '~gql';

import { MotionState } from './colonyMotions.ts';

export const getRolesNeededForMultiSigAction = (
  actionType: ColonyActionType,
): ColonyRole[] | undefined => {
  switch (actionType) {
    case ColonyActionType.MintTokensMultisig:
      return PERMISSIONS_NEEDED_FOR_ACTION.MintTokens;
    case ColonyActionType.UnlockTokenMultisig:
      return PERMISSIONS_NEEDED_FOR_ACTION.UnlockToken;
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
