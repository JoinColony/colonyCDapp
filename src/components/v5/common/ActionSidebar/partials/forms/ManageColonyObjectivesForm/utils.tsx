import { Colony } from '~types/graphql';

import { ManageColonyObjectivesFormValues } from './consts';

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
