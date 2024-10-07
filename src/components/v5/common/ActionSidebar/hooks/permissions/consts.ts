import { Action } from '~constants/actions.ts';

export const actionsWithoutReputationDecisionMethod = [
  Action.PaymentBuilder,
  Action.SplitPayment,
];

export const actionsWithStakingDecisionMethod = [
  Action.PaymentBuilder,
  Action.SplitPayment,
];
