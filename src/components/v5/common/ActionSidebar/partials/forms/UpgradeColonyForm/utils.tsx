import { RootMotionMethodNames } from '~redux/index.ts';
import { type Colony } from '~types/graphql.ts';
import { sanitizeHTML } from '~utils/strings/index.ts';

import { type UpgradeColonyFormValues } from './consts.ts';

export const getUpgradeColonyPayload = (
  colony: Colony,
  values: UpgradeColonyFormValues,
) => ({
  operationName: RootMotionMethodNames.Upgrade,
  colonyAddress: colony.colonyAddress,
  colonyName: colony.name,
  version: colony.version,
  motionParams: [colony.version + 1],
  annotationMessage: values.description
    ? sanitizeHTML(values.description)
    : undefined,
});
