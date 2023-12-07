import { DeepPartial } from 'utility-types';
import { ColonyActionType } from '~gql';
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
