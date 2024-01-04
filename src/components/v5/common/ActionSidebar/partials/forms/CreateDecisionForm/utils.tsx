import { DeepPartial } from 'utility-types';

import { ColonyActionType } from '~gql';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';

import { CreateDecisionFormValues } from './consts';

export const createDecisionDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<CreateDecisionFormValues>
> = async (_, { getActionTitleValues }) => {
  return getActionTitleValues({
    type: ColonyActionType.CreateDecisionMotion,
  });
};
