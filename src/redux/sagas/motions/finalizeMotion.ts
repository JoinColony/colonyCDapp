import { ClientType } from '@colony/colony-js';
import { call, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/actionTypes.ts';
import { type AllActions, type Action } from '~redux/types/actions/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
} from '../utils/index.ts';

function* finalizeMotion({
  meta,
  payload: { associatedActionId, colonyAddress, motionId, canMotionFail },
}: Action<ActionTypes.MOTION_FINALIZE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  const colonyManager = yield getColonyManager();
  const votingReputationClient = yield colonyManager.getClient(
    ClientType.VotingReputationClient,
    colonyAddress,
  );
  let contractMethodToCall = 'finalizeMotionWithoutFailure';

  // If motion is older than a week it can fail if the underlying action would fail
  if (canMotionFail) {
    // try to estimate gas, if it fails we call another contract
    try {
      yield votingReputationClient.estimateGas.finalizeMotionWithoutFailure(
        motionId,
      );
    } catch (err) {
      contractMethodToCall = 'finalizeMotion';
    }
  }

  try {
    const { finalizeMotionTransaction } = yield createTransactionChannels(
      meta.id,
      ['finalizeMotionTransaction'],
    );

    const batchKey = TRANSACTION_METHODS.FinalizeMotion;

    yield createGroupTransaction({
      channel: finalizeMotionTransaction,
      batchKey,
      meta,
      config: {
        associatedActionId,
        context: ClientType.VotingReputationClient,
        methodName: contractMethodToCall,
        identifier: colonyAddress,
        params: [motionId],
        ready: false,
      },
    });

    yield takeFrom(
      finalizeMotionTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    yield initiateTransaction(finalizeMotionTransaction.id);

    const { type } = yield waitForTxResult(finalizeMotionTransaction.channel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<AllActions>({
        type: ActionTypes.MOTION_FINALIZE_SUCCESS,
        meta,
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.MOTION_FINALIZE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* finalizeMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_FINALIZE, finalizeMotion);
}
