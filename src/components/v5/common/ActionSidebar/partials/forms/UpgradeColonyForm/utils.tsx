import { RootMotionMethodNames } from '~redux';
import { Colony } from '~types/graphql';

import { UpgradeColonyFormValues } from './consts';

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
