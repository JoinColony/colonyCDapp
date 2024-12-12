import { object, string } from 'yup';

import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';

export const getCancelDecisionMethodDescriptions = (userRole: string) => ({
  [DecisionMethod.Permissions]: formatText(
    {
      id: 'cancelModal.permissionsDescription',
    },
    {
      permission: userRole,
    },
  ),
  [DecisionMethod.Reputation]: formatText({
    id: 'cancelModal.reputationDescription',
  }),
});

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
