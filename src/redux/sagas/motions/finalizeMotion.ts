import { ClientType } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { call, put, takeEvery } from 'redux-saga/effects';

import { DEFAULT_GAS_LIMIT } from '~constants/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import { transactionUpdateGas } from '../../actionCreators/index.ts';
import { ActionTypes } from '../../actionTypes.ts';
import { type AllActions, type Action } from '../../types/actions/index.ts';
import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import { initiateTransaction, putError, takeFrom } from '../utils/index.ts';

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

    const batchKey = TRANSACTION_METHODS.FinalizeMotion;

    yield createGroupTransaction({
      channel: finalizeMotionTransaction,
      batchKey,
      meta,
      config: {
        context: ClientType.VotingReputationClient,
        methodName: 'finalizeMotion',
        identifier: colonyAddress,
        params: [motionId],
        ready: false,
      },
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
