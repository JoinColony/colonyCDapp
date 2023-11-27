import { DeepPartial } from 'utility-types';
import { ColonyActionType } from '~gql';
import { DECISION_METHOD } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { UpgradeColonyFormValues } from './consts';

export const upgradeColonyDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<UpgradeColonyFormValues>
> = async ({ decisionMethod }, { colony, getActionTitleValues }) => {
  return getActionTitleValues({
    type:
      decisionMethod === DECISION_METHOD.Permissions
        ? ColonyActionType.VersionUpgrade
        : ColonyActionType.VersionUpgradeMotion,
    newColonyVersion: (colony?.version ?? 0) + 1,
  });
};
