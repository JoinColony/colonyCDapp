import { object, string } from 'yup';

import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';

export const releaseDecisionMethodDescriptions: Partial<
  Record<DecisionMethod, string>
> = {
  [DecisionMethod.Permissions]: formatText({
    id: 'releaseModal.permissionsDescription',
  }),
  [DecisionMethod.PaymentCreator]: formatText({
    id: 'releaseModal.paymentCreatorDescription',
  }),
};

export const validationSchema = object()
  .shape({
    decisionMethod: object().shape({
      value: string().required(),
    }),
  })
  .defined();
