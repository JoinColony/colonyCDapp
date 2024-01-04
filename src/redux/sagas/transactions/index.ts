import { takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/actionTypes';

import { syncTransactionWithDb } from './transactionsToDb';

export * from './createTransaction';
export * from './estimateGasCost';
export * from './sendTransaction';
export * from './transactionChannel';

export function* setupTransactionSagas() {
  yield takeEvery(ActionTypes.TRANSACTION_CREATED, syncTransactionWithDb);
}
