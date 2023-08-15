import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux';

import { createTransaction, getTxChannel } from '../transactions';
import { putError, takeFrom } from '../utils';

function* cancelExpenditure({
  meta,
  payload: { colonyAddress, nativeExpenditureId },
}: Action<ActionTypes.EXPENDITURE_CANCEL>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'cancelExpenditure',
      identifier: colonyAddress,
      params: [nativeExpenditureId],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_CANCEL_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_CANCEL_ERROR, error, meta);
  }

  txChannel.close();

  return null;
}

export default function* cancelExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_CANCEL, cancelExpenditure);
}
