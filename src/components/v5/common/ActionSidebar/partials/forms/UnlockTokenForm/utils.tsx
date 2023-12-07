import { DeepPartial } from 'utility-types';
import { ColonyActionType } from '~gql';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { UnlockTokenFormValues } from './consts';

export const unlockTokenDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<UnlockTokenFormValues>
> = async ({ decisionMethod }, { getActionTitleValues }) => {
  return getActionTitleValues({
    type:
      decisionMethod === DecisionMethod.Permissions
        ? ColonyActionType.UnlockToken
        : ColonyActionType.UnlockTokenMotion,
  });
};
