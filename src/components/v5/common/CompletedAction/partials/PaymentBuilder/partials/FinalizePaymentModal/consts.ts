import { object, string } from 'yup';

import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';

export const getFinalizeDecisionMethodDescriptions = (
  userRole: string,
): Partial<Record<DecisionMethod, string>> => ({
  [DecisionMethod.Permissions]: formatText(
    {
      id: 'finalizeModal.permissionsDescription',
    },
    {
      permission: userRole,
    },
  ),
  [DecisionMethod.Reputation]: formatText({
    id: 'finalizeModal.reputationDescription',
  }),
  [DecisionMethod.PaymentCreator]: formatText({
    id: 'finalizeModal.paymentCreatorDescription',
  }),
});

export const validationSchema = object()
  .shape({
    decisionMethod: object().shape({
      value: string().required(),
    }),
  })
  .defined();
