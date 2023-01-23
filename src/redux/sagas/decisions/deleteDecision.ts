import { call, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/actionTypes';
import { Action } from '~redux/types';
import { removeDecisionFromLocalStorage } from '~utils/decisions';

function* deleteDecision({
  payload: walletAddress,
}: Action<ActionTypes.DECISION_DRAFT_REMOVED>) {
  yield call(removeDecisionFromLocalStorage, walletAddress);
}

export default function* deleteDecisionSaga() {
  yield takeEvery(ActionTypes.DECISION_DRAFT_REMOVED, deleteDecision);
}
