import { CORE_DECISIONS_LIST } from '~redux/constants.ts';
import { Decision } from '~redux/immutable/Decision.ts';
import {
  CoreDecisions,
  type CoreDecisionsRecord,
} from '~redux/state/decisions.ts';
import { type ReducerType } from '~redux/types/index.ts';

import { ActionTypes } from '../actionTypes.ts';

const coreDecisionsReducer: ReducerType<CoreDecisionsRecord> = (
  state = CoreDecisions(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.DECISION_DRAFT_CREATED: {
      return state.setIn(
        [
          CORE_DECISIONS_LIST,
          `${action.payload.walletAddress}_${action.payload.colonyAddress}`,
        ],
        Decision(action.payload),
      );
    }
    case ActionTypes.DECISION_DRAFT_REMOVED: {
      return state.deleteIn([
        CORE_DECISIONS_LIST,
        `${action.payload.walletAddress}_${action.payload.colonyAddress}`,
      ]);
    }
    default:
      return state;
  }
};

export default coreDecisionsReducer;
