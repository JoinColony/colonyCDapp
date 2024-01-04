import { ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions';
import { initiateTransaction, putError } from '../utils';

function* reclaimExpenditureStake({
  payload: { colonyAddress, nativeExpenditureId },
  meta,
}: Action<ActionTypes.RECLAIM_EXPENDITURE_STAKE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.StakedExpenditureClient,
      methodName: 'reclaimStake',
      identifier: colonyAddress,
      params: [nativeExpenditureId],
    });

    yield initiateTransaction({ id: meta.id });

    yield waitForTxResult(txChannel);

    yield put<AllActions>({
      type: ActionTypes.RECLAIM_EXPENDITURE_STAKE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.RECLAIM_EXPENDITURE_STAKE_ERROR,
      error,
      meta,
    );
  }

  txChannel.close();

  return null;
}

export default function* reclaimExpenditureStakeSaga() {
  yield takeEvery(
    ActionTypes.RECLAIM_EXPENDITURE_STAKE,
    reclaimExpenditureStake,
  );
}
