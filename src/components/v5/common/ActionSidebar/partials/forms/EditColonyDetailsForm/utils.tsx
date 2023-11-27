import { DeepPartial } from 'utility-types';
import { ColonyActionType } from '~gql';
import { DECISION_METHOD } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { EditColonyDetailsFormValues } from './consts';

export const editColonyDetailsDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<EditColonyDetailsFormValues>
> = async ({ decisionMethod }, { getActionTitleValues }) => {
  return getActionTitleValues({
    type:
      decisionMethod === DECISION_METHOD.Permissions
        ? ColonyActionType.ColonyEdit
        : ColonyActionType.ColonyEditMotion,
  });
};
