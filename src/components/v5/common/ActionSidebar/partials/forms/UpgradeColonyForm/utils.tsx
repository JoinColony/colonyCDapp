import { RootMotionMethodNames } from '~redux/index.ts';
import { Colony } from '~types/graphql.ts';

import { UpgradeColonyFormValues } from './consts.ts';

export const getUpgradeColonyPayload = (
  colony: Colony,
  values: UpgradeColonyFormValues,
) => ({
  operationName: RootMotionMethodNames.Upgrade,
  colonyAddress: colony.colonyAddress,
  colonyName: colony.name,
  version: colony.version,
  motionParams: [colony.version + 1],
  annotationMessage: values.description,
});
