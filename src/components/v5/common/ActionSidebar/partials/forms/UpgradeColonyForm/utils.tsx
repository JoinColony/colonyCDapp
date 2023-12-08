import { DeepPartial } from 'utility-types';

import { ColonyActionType } from '~gql';
import { RootMotionMethodNames } from '~redux';
import { Colony } from '~types';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';

import { UpgradeColonyFormValues } from './consts';

export const upgradeColonyDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<UpgradeColonyFormValues>
> = async ({ decisionMethod }, { colony, getActionTitleValues }) => {
  return getActionTitleValues({
    type:
      decisionMethod === DecisionMethod.Permissions
        ? ColonyActionType.VersionUpgrade
        : ColonyActionType.VersionUpgradeMotion,
    newColonyVersion: (colony?.version ?? 0) + 1,
  });
};

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
