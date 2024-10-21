import { object, string } from 'yup';

import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';

export const cancelDecisionMethodDescriptions = {
  [DecisionMethod.Permissions]: formatText({
    id: 'cancelModal.permissionsDescription',
  }),
  [DecisionMethod.Reputation]: formatText({
    id: 'cancelModal.reputationDescription',
  }),
};

export const validationSchema = object()
  .shape({
    decisionMethod: object().shape({
      value: string().required(),
    }),
    penalise: string(),
  })
  .defined();

export const stakedValidationSchema = object()
  .shape({
    decisionMethod: object().shape({
      value: string().required(),
    }),
    penalise: string().required(),
  })
  .defined();
