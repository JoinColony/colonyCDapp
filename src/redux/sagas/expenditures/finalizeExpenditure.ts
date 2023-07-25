import { ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux';

import { createTransaction, getTxChannel } from '../transactions';
import { putError, takeFrom } from '../utils';

function* finalizeExpenditure({
  payload: { colonyAddress, nativeExpenditureId },
  meta,
}: Action<ActionTypes.EXPENDITURE_FINALIZE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'finalizeExpenditure',
      identifier: colonyAddress,
      params: [nativeExpenditureId],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_FINALIZE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_FINALIZE_ERROR, error, meta);
  }

  txChannel.close();

  return null;
}

export default function* finalizeExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_FINALIZE, finalizeExpenditure);
}
