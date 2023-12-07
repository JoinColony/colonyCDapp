import { DeepPartial } from 'utility-types';
import { ColonyActionType } from '~gql';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { EditColonyDetailsFormValues } from './consts';

export const editColonyDetailsDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<EditColonyDetailsFormValues>
> = async ({ decisionMethod }, { getActionTitleValues }) => {
  return getActionTitleValues({
    type:
      decisionMethod === DecisionMethod.Permissions
        ? ColonyActionType.ColonyEdit
        : ColonyActionType.ColonyEditMotion,
  });
};
