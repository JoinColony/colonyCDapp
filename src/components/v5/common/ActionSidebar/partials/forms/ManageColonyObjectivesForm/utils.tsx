import { DeepPartial } from 'utility-types';
import { ColonyActionType } from '~gql';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { ManageColonyObjectivesFormValues } from './consts';

export const manageColonyObjectivesDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<ManageColonyObjectivesFormValues>
> = async (_, { getActionTitleValues }) =>
  getActionTitleValues({
    type: ColonyActionType.ColonyEdit,
    pendingColonyMetadata: {
      changelog: [
        {
          hasObjectiveChanged: true,
        },
      ],
    },
  });
