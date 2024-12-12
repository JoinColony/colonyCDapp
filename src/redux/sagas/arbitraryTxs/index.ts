import { all, call } from 'redux-saga/effects';

import arbitraryTxActionSaga from './arbitraryTx.ts';

export default function* arbitraryTxSagas() {
  yield all([call(arbitraryTxActionSaga)]);
}
