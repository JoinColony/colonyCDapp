import { DeepPartial } from 'utility-types';
import { ColonyActionType } from '~gql';
import { DECISION_METHOD } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { UnlockTokenFormValues } from './consts';

export const unlockTokenDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<UnlockTokenFormValues>
> = async ({ decisionMethod }, { getActionTitleValues }) => {
  return getActionTitleValues({
    type:
      decisionMethod === DECISION_METHOD.Permissions
        ? ColonyActionType.UnlockToken
        : ColonyActionType.UnlockTokenMotion,
  });
};
