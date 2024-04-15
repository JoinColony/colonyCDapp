import { RootMotionMethodNames } from '~redux/index.ts';
import { type Colony } from '~types/graphql.ts';
import { sanitizeHTML } from '~utils/strings.ts';

import { type UnlockTokenFormValues } from './consts.ts';

export const getUnlockTokenPayload = (
  colony: Colony,
  { description: annotationMessage, title }: UnlockTokenFormValues,
) => ({
  annotationMessage: annotationMessage
    ? sanitizeHTML(annotationMessage)
    : undefined,
  colonyAddress: colony.colonyAddress,
  operationName: RootMotionMethodNames.UnlockToken,
  motionParams: [],
  colonyName: colony.name,
  customActionTitle: title,
});
