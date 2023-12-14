import { DeepPartial } from 'utility-types';
import { ColonyActionType } from '~gql';
import { Colony } from '~types';
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

export const getManageColonyObjectivesPayload = (
  colony: Colony,
  values: ManageColonyObjectivesFormValues,
) => ({
  colony,
  colonyObjective: {
    title: values.colonyObjectiveTitle,
    description: values.colonyObjectiveDescription,
    progress: values.colonyObjectiveProgress,
  },
  motionDomainId: values.createdIn,
  annotationMessage: values.description,
});
