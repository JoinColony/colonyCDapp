import { DeepPartial } from 'utility-types';

import { ColonyActionType } from '~gql';
import { Colony, User } from '~types';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';

import { EnterRecoveryModeFormValues } from './consts';

export const enterRecoveryModeDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<EnterRecoveryModeFormValues>
> = async (_, { getActionTitleValues }) => {
  return getActionTitleValues({
    type: ColonyActionType.Recovery,
  });
};

export const getRecoveryModePayload = (
  colony: Colony,
  values: EnterRecoveryModeFormValues,
  user?: User | null,
) => ({
  colonyName: colony.name,
  colonyAddress: colony.colonyAddress,
  walletAddress: user?.walletAddress,
  annotationMessage: values.description,
  customActionTitle: '',
});
