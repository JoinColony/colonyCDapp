import { object, string } from 'yup';

import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';

export const getMilestoneReleaseDecisionMethodDescriptions = (
  userRole: string,
) => ({
  [DecisionMethod.Permissions]: formatText(
    {
      id: 'fundingModal.permissionsDescription',
    },
    {
      permission: userRole,
    },
  ),
  [DecisionMethod.Reputation]: formatText({
    id: 'fundingModal.reputationDescription',
  }),
  [DecisionMethod.PaymentCreator]: formatText({
    id: 'releaseModal.paymentCreatorDescription',
  }),
});

export const getValidationSchema = () =>
  object()
    .shape({
      decisionMethod: object().shape({
        value: string().required(),
      }),
    })
    .defined();
