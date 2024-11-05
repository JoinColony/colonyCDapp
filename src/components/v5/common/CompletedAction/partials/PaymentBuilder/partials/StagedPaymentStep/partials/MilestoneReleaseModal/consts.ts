import { object, string } from 'yup';

import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';

export const getMilestoneReleaseDecisionMethodDescriptions = (
  userRole: string,
) => ({
  [DecisionMethod.Permissions]: formatText(
    {
      id: 'milestoneModal.permissionsDescription',
    },
    {
      permission: userRole,
    },
  ),
  [DecisionMethod.Reputation]: formatText({
    id: 'milestoneModal.reputationDescription',
  }),
  [DecisionMethod.PaymentCreator]: formatText({
    id: 'milestoneModal.paymentCreatorDescription',
  }),
  // @TODO: Add multi-sig
  // [DecisionMethod.PaymentCreator]: formatText({
  //   id: 'milestoneModal.multiSig',
  // }),
});

export const getValidationSchema = () =>
  object()
    .shape({
      decisionMethod: object().shape({
        value: string().required(),
      }),
    })
    .defined();
