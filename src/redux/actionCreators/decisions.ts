import { ActionTypes } from '~redux/actionTypes';
import { Address, ColonyDecision } from '~types';

export const createDecisionAction = (decision: ColonyDecision) => ({
  type: ActionTypes.DECISION_DRAFT_CREATED,
  payload: decision,
});

export const removeDecisionAction = (walletAddress: Address) => ({
  type: ActionTypes.DECISION_DRAFT_REMOVED,
  payload: walletAddress,
});
