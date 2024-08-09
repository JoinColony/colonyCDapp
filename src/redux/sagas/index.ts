import { call, takeLatest } from 'redux-saga/effects';

import { ActionTypes } from '../actionTypes.ts';

import ipfsSagas from './ipfs.ts';
import { setupUserContext, cleanupOnWalletError } from './setupUserContext.ts';

export default function* rootSaga() {
  /*
   * WALLET_OPEN
   * is the entry point for all other sagas that depend on the user having a wallet
   * -> ddb, colonyJS, etc and all subsequent actions
   */
  yield takeLatest(ActionTypes.WALLET_OPEN, setupUserContext);
  yield takeLatest(ActionTypes.WALLET_OPEN_ERROR, cleanupOnWalletError);
  // Everything else that does not require a wallet
  yield call(ipfsSagas);
}

export * from './messages/index.ts';
export * from './transactions/index.ts';
