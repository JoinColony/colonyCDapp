import { object, string } from 'yup';

import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';

export const getEditDecisionMethodDescriptions = (userRole: string) => ({
  [DecisionMethod.Permissions]: formatText(
    {
      id: 'fundingModal.permissionsDescription',
    },
    {
      permission: userRole,
    },
  ),
  // [DecisionMethod.Reputation]: formatText({
  //   id: 'fundingModal.reputationDescription',
  // }),
});

export const validationSchema = object()
  .shape({
    decisionMethod: object().shape({
      value: string().required(),
    }),
  })
  .defined();
