import { call, takeLatest } from 'redux-saga/effects';

import { ActionTypes } from '../actionTypes';

import setupUserContext from './setupUserContext';
import ipfsSagas from './ipfs';

export default function* rootSaga() {
  /*
   * WALLET_CREATE
   * is the entry point for all other sagas that depend on the user having a wallet
   * -> ddb, colonyJS, etc and all subsequent actions
   */
  yield takeLatest(ActionTypes.WALLET_CREATE, setupUserContext);
  // Everything else that does not require a wallet
  yield call(ipfsSagas);
}

export * from './transactions';
export * from './messages';
export * from './ipfs';
export * from './users';
export * from './utils';
export * from './wallet';
export * from './actions';
export * from './extensions';
export * from './motions';
export * from './vesting';
export * from './whitelist';
