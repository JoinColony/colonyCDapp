import { RootMotionMethodNames } from '~redux';
import { Colony } from '~types';

import { UnlockTokenFormValues } from './consts';

export const getUnlockTokenPayload = (
  colony: Colony,
  { description: annotationMessage, title }: UnlockTokenFormValues,
) => ({
  annotationMessage,
  colonyAddress: colony.colonyAddress,
  operationName: RootMotionMethodNames.UnlockToken,
  motionParams: [],
  colonyName: colony.name,
  customActionTitle: title,
});
