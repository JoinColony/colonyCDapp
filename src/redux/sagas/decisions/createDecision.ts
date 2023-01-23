import { call, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/actionTypes';
import { Action } from '~redux/types';
import { setDecisionToLocalStorage } from '~utils/decisions';

function* createDecision({
  payload: decision,
}: Action<ActionTypes.DECISION_DRAFT_CREATED>) {
  yield call(setDecisionToLocalStorage, decision, decision.walletAddress);
}

export default function* createDecisionSaga() {
  yield takeEvery(ActionTypes.DECISION_DRAFT_CREATED, createDecision);
}
