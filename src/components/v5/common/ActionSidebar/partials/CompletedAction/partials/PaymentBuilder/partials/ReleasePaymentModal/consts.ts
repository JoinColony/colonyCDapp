import { object, string } from 'yup';

import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';

export const getReleaseDecisionMethodDescriptions = (
  userRole: string,
): Partial<Record<DecisionMethod, string>> => ({
  [DecisionMethod.Permissions]: formatText(
    {
      id: 'releaseModal.permissionsDescription',
    },
    {
      permission: userRole,
    },
  ),
  [DecisionMethod.PaymentCreator]: formatText({
    id: 'releaseModal.paymentCreatorDescription',
  }),
});

export const validationSchema = object()
  .shape({
    decisionMethod: object().shape({
      value: string().required(),
    }),
  })
  .defined();
