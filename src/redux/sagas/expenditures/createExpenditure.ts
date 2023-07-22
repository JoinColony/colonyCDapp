import { ClientType } from '@colony/colony-js';
import { takeEvery, fork, call, put } from 'redux-saga/effects';
import { BigNumber } from 'ethers';

import { Action, ActionTypes, AllActions } from '~redux';

import { createTransaction, getTxChannel } from '../transactions';
import { putError, takeFrom } from '../utils';

export function* createExpenditure({
  meta,
  payload: { colonyAddress },
}: Action<ActionTypes.EXPENDITURE_CREATE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'makeExpenditure',
      identifier: colonyAddress,
      params: [1, BigNumber.from(2).pow(256).sub(1), 1],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_CREATE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }

  return null;
}

export default function* createExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_CREATE, createExpenditure);
}
