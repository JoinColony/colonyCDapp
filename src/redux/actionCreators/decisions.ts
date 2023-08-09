import { ActionTypes } from '~redux/actionTypes';
import { Address } from '~types';
import { DecisionDraft } from '~utils/decisions';

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
