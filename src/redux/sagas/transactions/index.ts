import { takeEvery } from 'redux-saga/effects';
import { syncTransactionWithDb } from './transactionsToDb';
import { ActionTypes } from '~redux/actionTypes';

export * from './createTransaction';
export * from './estimateGasCost';
export * from './sendTransaction';
export * from './transactionChannel';

export function* setupTransactionSagas() {
  yield takeEvery(ActionTypes.TRANSACTION_CREATED, syncTransactionWithDb);
}
