import { BigNumber } from 'ethers';
import { call, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { initiateTransaction, putError, takeFrom } from '../utils';

import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions';
import { transactionUpdateGas } from '../../actionCreators';
import { DEFAULT_GAS_LIMIT } from '~constants';

function* finalizeMotion({
  meta,
  payload: { colonyAddress, motionId, gasEstimate },
}: Action<ActionTypes.MOTION_FINALIZE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const { finalizeMotionTransaction } = yield createTransactionChannels(
      meta.id,
      ['finalizeMotionTransaction'],
    );

    const batchKey = 'finalizeMotion';

    yield createGroupTransaction(finalizeMotionTransaction, batchKey, meta, {
      context: ClientType.VotingReputationClient,
      methodName: 'finalizeMotion',
      identifier: colonyAddress,
      params: [motionId],
      ready: false,
    });

    yield takeFrom(
      finalizeMotionTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    const gasLimit = BigNumber.from(gasEstimate).lte(DEFAULT_GAS_LIMIT)
      ? gasEstimate
      : DEFAULT_GAS_LIMIT.toString();

    yield put(
      transactionUpdateGas(finalizeMotionTransaction.id, {
        gasLimit,
      }),
    );

    yield initiateTransaction({ id: finalizeMotionTransaction.id });

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
