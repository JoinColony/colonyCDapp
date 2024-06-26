import { UserRole } from '~constants/permissions.ts';
import { ColonyActionType, type ColonyActionFragment } from '~gql';

import { MotionState } from './colonyMotions.ts';

export const getMultiSigRequiredRole = (
  actionType: ColonyActionType,
): UserRole => {
  switch (actionType) {
    case ColonyActionType.MintTokensMultisig:
      return UserRole.Owner;
    default:
      return UserRole.Owner;
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
