import { ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import { initiateTransaction, putError } from '../utils/index.ts';

export type ReclaimExpenditureStakePayload =
  Action<ActionTypes.RECLAIM_EXPENDITURE_STAKE>['payload'];

function* reclaimExpenditureStake({
  payload: { associatedActionId, colonyAddress, nativeExpenditureId },
  meta,
}: Action<ActionTypes.RECLAIM_EXPENDITURE_STAKE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.StakedExpenditureClient,
      group: {
        key: TRANSACTION_METHODS.ReclaimStake,
        id: meta.id,
        index: 0,
      },
      methodName: 'reclaimStake',
      identifier: colonyAddress,
      params: [nativeExpenditureId],
      associatedActionId,
    });

    yield initiateTransaction(meta.id);

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
