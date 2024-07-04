import { DecisionMethod } from '~types/actions.ts';
import { type Colony } from '~types/graphql.ts';
import { getMultiSigPayload } from '~utils/multiSig.ts';
import { sanitizeHTML } from '~utils/strings.ts';

import { type ManageColonyObjectivesFormValues } from './consts.ts';

export const getManageColonyObjectivesPayload = (
  colony: Colony,
  values: ManageColonyObjectivesFormValues,
) => {
  const baseDomainPayload = {
    colony,
    colonyObjective: {
      title: values.colonyObjectiveTitle,
      description: values.colonyObjectiveDescription,
      progress: values.colonyObjectiveProgress,
    },
    motionDomainId: values.createdIn,
    annotationMessage: values.description
      ? sanitizeHTML(values.description)
      : undefined,
  };

  if (values.decisionMethod === DecisionMethod.Permissions) {
    return baseDomainPayload;
  }

  return {
    ...baseDomainPayload,
    ...getMultiSigPayload(
      values.decisionMethod === DecisionMethod.MultiSig,
      colony,
    ),
  };
};
