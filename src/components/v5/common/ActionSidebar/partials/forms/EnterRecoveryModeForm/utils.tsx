import { DeepPartial } from 'utility-types';

import { ColonyActionType } from '~gql';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';

import { EnterRecoveryModeFormValues } from './consts';

export const enterRecoveryModeDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<EnterRecoveryModeFormValues>
> = async (_, { getActionTitleValues }) => {
  return getActionTitleValues({
    type: ColonyActionType.Recovery,
  });
};
