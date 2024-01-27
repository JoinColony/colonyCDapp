import { call, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/actionTypes.ts';
import { Action } from '~redux/types/index.ts';
import { setDraftDecisionToLocalStorage } from '~utils/decisions.ts';

function* createDecision({
  payload: decision,
}: Action<ActionTypes.DECISION_DRAFT_CREATED>) {
  yield call(
    setDraftDecisionToLocalStorage,
    decision,
    decision.walletAddress,
    decision.colonyAddress,
  );
}

export default function* createDecisionSaga() {
  yield takeEvery(ActionTypes.DECISION_DRAFT_CREATED, createDecision);
}
