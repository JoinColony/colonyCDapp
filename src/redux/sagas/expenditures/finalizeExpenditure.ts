import { ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import { initiateTransaction, putError } from '../utils/index.ts';

export type FinalizeExpenditurePayload =
  Action<ActionTypes.EXPENDITURE_FINALIZE>['payload'];

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

    yield initiateTransaction({ id: meta.id });

    const { type } = yield waitForTxResult(txChannel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<AllActions>({
        type: ActionTypes.EXPENDITURE_FINALIZE_SUCCESS,
        payload: {},
        meta,
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_FINALIZE_ERROR, error, meta);
  }

  txChannel.close();

  return null;
}

export default function* finalizeExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_FINALIZE, finalizeExpenditure);
}
