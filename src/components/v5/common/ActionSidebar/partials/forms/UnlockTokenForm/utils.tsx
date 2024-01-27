import { RootMotionMethodNames } from '~redux/index.ts';
import { Colony } from '~types/graphql.ts';

import { UnlockTokenFormValues } from './consts.ts';

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
