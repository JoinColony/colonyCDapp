import { CORE_DECISIONS_LIST } from '~redux/constants';
import { Decision } from '~redux/immutable/Decision';
import { CoreDecisions, CoreDecisionsRecord } from '~redux/state/decisions';
import { ReducerType } from '~redux/types';

import { ActionTypes } from '../actionTypes';

const coreDecisionsReducer: ReducerType<CoreDecisionsRecord> = (
  state = CoreDecisions(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.DECISION_DRAFT_CREATED:
      return state.setIn(
        [CORE_DECISIONS_LIST, action.payload.walletAddress],
        Decision(action.payload),
      );
    case ActionTypes.DECISION_DRAFT_REMOVED:
      return state.deleteIn([CORE_DECISIONS_LIST, action.payload]);
    default:
      return state;
  }
};

export default coreDecisionsReducer;
