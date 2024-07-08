import { ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/actionTypes.ts';
import { type Action, type AllActions } from '~redux/types/index.ts';

import {
  createTransaction,
  waitForTxResult,
  getTxChannel,
} from '../transactions/index.ts';
import { initiateTransaction, putError, takeFrom } from '../utils/index.ts';

function* cancelMultiSig({
  payload: { colonyAddress, motionId },
  meta,
}: Action<ActionTypes.MULTISIG_CANCEL>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.MultisigPermissionsClient,
      methodName: 'cancel',
      identifier: colonyAddress,
      params: [motionId],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction({ id: meta.id });

    yield waitForTxResult(txChannel);

    yield put<AllActions>({
      type: ActionTypes.MULTISIG_CANCEL_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.MULTISIG_CANCEL_ERROR, error, meta);
  }

  txChannel.close();

  return null;
}

export default function* cancelMultiSigSaga() {
  yield takeEvery(ActionTypes.MULTISIG_CANCEL, cancelMultiSig);
}