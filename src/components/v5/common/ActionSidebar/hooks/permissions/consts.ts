import { Action } from '~constants/actions.ts';

// @TODO: Add staged
export const actionsWithoutReputationDecisionMethod = [
  Action.PaymentBuilder,
  Action.SplitPayment,
];

export const actionsWithStakingDecisionMethod = [
  Action.PaymentBuilder,
  Action.StagedPayment,
  Action.SplitPayment,
];
