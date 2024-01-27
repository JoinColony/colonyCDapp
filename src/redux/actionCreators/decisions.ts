import { ActionTypes } from '~redux/actionTypes.ts';
import { Address } from '~types/index.ts';
import { DecisionDraft } from '~utils/decisions.ts';

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
