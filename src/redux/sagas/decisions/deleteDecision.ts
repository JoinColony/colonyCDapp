import { call, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/actionTypes.ts';
import { type Action } from '~redux/types/index.ts';
import { removeDraftDecisionFromLocalStorage } from '~utils/decisions.ts';

function* deleteDecision({
  payload: { walletAddress, colonyAddress },
}: Action<ActionTypes.DECISION_DRAFT_REMOVED>) {
  yield call(removeDraftDecisionFromLocalStorage, walletAddress, colonyAddress);
}

export default function* deleteDecisionSaga() {
  yield takeEvery(ActionTypes.DECISION_DRAFT_REMOVED, deleteDecision);
}
