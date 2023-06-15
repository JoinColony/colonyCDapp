import { RootMotionMethodNames } from '~redux';
import { Colony } from '~types';

export const getUnlockTokenDialogPayload = (
  colony: Colony,
  { annotationMessage },
) => ({
  annotationMessage,
  colonyAddress: colony?.colonyAddress,
  operationName: RootMotionMethodNames.UnlockToken,
  motionParams: [],
  colonyName: colony?.name,
});
