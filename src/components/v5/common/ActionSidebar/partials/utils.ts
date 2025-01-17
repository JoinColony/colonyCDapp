import { Extension } from '@colony/colony-js';

import { Action } from '~constants/actions.ts';

export const getNeededExtension = (action: Action) => {
  switch (action) {
    case Action.CreateDecision:
      return Extension.VotingReputation;
    case Action.StreamingPayment:
      return Extension.StreamingPayments;
    default:
      return '';
  }
};
