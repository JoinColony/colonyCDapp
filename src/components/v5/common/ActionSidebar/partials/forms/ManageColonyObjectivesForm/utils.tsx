import { type Colony } from '~types/graphql.ts';

import { type ManageColonyObjectivesFormValues } from './consts.ts';

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
