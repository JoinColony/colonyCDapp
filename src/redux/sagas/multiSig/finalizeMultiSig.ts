import { ClientType } from '@colony/colony-js';
import { takeEvery, call, fork, put } from 'redux-saga/effects';

import { type Action, ActionTypes, type AllActions } from '~redux';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import { initiateTransaction, putError, takeFrom } from '../utils/effects.ts';

function* finalizeMultiSigAction({
  payload: { colonyAddress, multiSigId },
  meta,
}: Action<ActionTypes.MULTISIG_FINALIZE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    if (!colonyAddress || !multiSigId) {
      throw new Error('No colony address or multiSigId');
    }

    yield fork(createTransaction, meta.id, {
      context: ClientType.MultisigPermissionsClient,
      methodName: 'executeWithoutFailure',
      identifier: colonyAddress,
      params: [multiSigId],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction({ id: meta.id });

    const { type } = yield waitForTxResult(txChannel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<AllActions>({
        type: ActionTypes.MULTISIG_FINALIZE_SUCCESS,
        meta,
      });
    }
  } catch (error) {
    yield putError(ActionTypes.MULTISIG_FINALIZE_ERROR, error, meta);
  }

  txChannel.close();
}

export default function* finalizeMultiSigSaga() {
  yield takeEvery(ActionTypes.MULTISIG_FINALIZE, finalizeMultiSigAction);
}
