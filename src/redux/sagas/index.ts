import { call, takeLatest } from 'redux-saga/effects';

import { ActionTypes } from '../actionTypes';

import ipfsSagas from './ipfs';
import setupUserContext from './setupUserContext';

export default function* rootSaga() {
  /*
   * WALLET_OPEN
   * is the entry point for all other sagas that depend on the user having a wallet
   * -> ddb, colonyJS, etc and all subsequent actions
   */
  yield takeLatest(ActionTypes.WALLET_OPEN, setupUserContext);
  // Everything else that does not require a wallet
  yield call(ipfsSagas);
}

export * from './messages';
export * from './transactions';
