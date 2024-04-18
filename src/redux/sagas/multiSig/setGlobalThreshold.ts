import { ClientType } from '@colony/colony-js';
import { takeEvery, call, fork, put } from 'redux-saga/effects';

import { type Action, ActionTypes, type AllActions } from '~redux';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import { initiateTransaction, putError, takeFrom } from '../utils/index.ts';

function* setGlobalThresholdAction({
  payload: { colonyAddress, threshold },
  meta,
}: Action<ActionTypes.MULTISIG_SET_GLOBAL_THRESHOLD>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    if (!colonyAddress) {
      throw new Error(
        'No colony address set for setGlobalThreshold transaction',
      );
    }

    yield fork(createTransaction, meta.id, {
      context: ClientType.MultisigPermissionsClient,
      methodName: 'setGlobalThreshold',
      identifier: colonyAddress,
      params: [threshold],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction({ id: meta.id });

    const { type } = yield waitForTxResult(txChannel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<AllActions>({
        type: ActionTypes.MULTISIG_SET_GLOBAL_THRESHOLD_SUCCESS,
        meta,
      });
    }
  } catch (error) {
    yield putError(
      ActionTypes.MULTISIG_SET_GLOBAL_THRESHOLD_ERROR,
      error,
      meta,
    );
  }

  txChannel.close();
}

export default function* setGlobalThresholdSaga() {
  yield takeEvery(
    ActionTypes.MULTISIG_SET_GLOBAL_THRESHOLD,
    setGlobalThresholdAction,
  );
}
