import { ActionTypes } from '~redux/actionTypes.ts';
import { type Address } from '~types/index.ts';
import { type DecisionDraft } from '~utils/decisions.ts';

export const createDecisionAction = (decision: DecisionDraft) => {
  return {
    type: ActionTypes.DECISION_DRAFT_CREATED,
    payload: decision,
  };
};

export const removeDecisionAction = (
  walletAddress: Address,
  colonyAddress: Address,
) => ({
  type: ActionTypes.DECISION_DRAFT_REMOVED,
  payload: { walletAddress, colonyAddress },
});
