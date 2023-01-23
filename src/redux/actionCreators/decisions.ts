import { ActionTypes } from '~redux/actionTypes';
import { Address, Decision } from '~types';

export const createDecisionAction = (decision: Decision) => ({
  type: ActionTypes.DECISION_DRAFT_CREATED,
  payload: decision,
});

export const removeDecisionAction = (walletAddress: Address) => ({
  type: ActionTypes.DECISION_DRAFT_REMOVED,
  payload: walletAddress,
});
