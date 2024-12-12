import { Action } from '~constants/actions.ts';

export const actionsWithoutReputationDecisionMethod = [
  Action.PaymentBuilder,
  Action.StagedPayment,
  Action.SplitPayment,
];

export const actionsWithoutMultiSigDecisionMethod = [
  Action.PaymentBuilder,
  Action.StagedPayment,
  Action.SplitPayment,
];

export const actionsWithStakingDecisionMethod = [
  Action.PaymentBuilder,
  Action.StagedPayment,
  Action.SplitPayment,
];
