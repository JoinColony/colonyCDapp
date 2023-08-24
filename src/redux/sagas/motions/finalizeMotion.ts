import { call, put, takeEvery } from 'redux-saga/effects';
import { AnyVotingReputationClient, ClientType } from '@colony/colony-js';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { getColonyManager, putError, takeFrom } from '../utils';

import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { transactionReady, transactionUpdateGas } from '../../actionCreators';

function* finalizeMotion({
  meta,
  payload: { userAddress, colonyAddress, motionId },
}: Action<ActionTypes.MOTION_FINALIZE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const colonyManager = yield getColonyManager();
    const { provider } = colonyManager;

    const votingReputationClient: AnyVotingReputationClient =
      yield colonyManager.getClient(
        ClientType.VotingReputationClient,
        colonyAddress,
      );

    const encodedFinalizeMotion =
      // @NOTE: I'm asserting the param here because according to typescript this value is not compatible with the type expected. It's  wrong, this is a valid function name.
      votingReputationClient.interface.encodeFunctionData(
        'finalizeMotion(uint256)' as any,
        [motionId],
      );
    const finalizeEstimate = yield provider.estimateGas({
      from: userAddress,
      to: votingReputationClient.address,
      data: encodedFinalizeMotion,
    });

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

    yield put(
      transactionUpdateGas(finalizeMotionTransaction.id, {
        gasLimit: finalizeEstimate.toString(),
      }),
    );

    yield put(transactionReady(finalizeMotionTransaction.id));

    yield takeFrom(
      finalizeMotionTransaction.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    yield put<AllActions>({
      type: ActionTypes.MOTION_FINALIZE_SUCCESS,
      meta,
    });
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
