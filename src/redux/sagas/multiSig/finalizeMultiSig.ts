import { ClientType } from '@colony/colony-js';
import { takeEvery, call, fork, put } from 'redux-saga/effects';

import { type Action, ActionTypes, type AllActions } from '~redux';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import { initiateTransaction, putError, takeFrom } from '../utils/effects.ts';

function* finalizeMultiSigAction({
  payload: { colonyAddress, multiSigId, canActionFail, associatedActionId },
  meta,
}: Action<ActionTypes.MULTISIG_FINALIZE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  const batchKey = TRANSACTION_METHODS.FinalizeMultiSig;

  try {
    if (!colonyAddress || !multiSigId) {
      throw new Error('No colony address or multiSigId');
    }

    yield fork(createTransaction, meta.id, {
      context: ClientType.MultisigPermissionsClient,
      methodName: canActionFail ? 'execute' : 'executeWithoutFailure',
      identifier: colonyAddress,
      params: [multiSigId],
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      associatedActionId,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction(meta.id);

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
