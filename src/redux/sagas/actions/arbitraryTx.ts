import { takeEvery } from 'redux-saga/effects';

import { type Action, ActionTypes } from '~redux/index.ts';

function* arbitraryTxSaga({
  payload,
}: Action<ActionTypes.CREATE_ARBITRARY_TRANSACTION>) {
  // eslint-disable-next-line no-console
  console.log(payload);
  yield;
  return {};
}

export default function* arbitraryTxActionSaga() {
  yield takeEvery(ActionTypes.CREATE_ARBITRARY_TRANSACTION, arbitraryTxSaga);
}
