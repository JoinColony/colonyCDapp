import { takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/actionTypes.ts';

import { syncTransactionWithDb } from './transactionsToDb.ts';

export * from './createTransaction.ts';
export * from './estimateGasCost.ts';
export * from './sendTransaction.ts';
export * from './transactionChannel.ts';

export function* setupTransactionSagas() {
  yield takeEvery(ActionTypes.TRANSACTION_CREATED, syncTransactionWithDb);
}
