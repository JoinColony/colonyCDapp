import { call, put, takeEvery } from 'redux-saga/effects';
import { AnyVotingReputationClient, ClientType } from '@colony/colony-js';
import { BigNumber } from 'ethers';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { getColonyManager, putError, takeFrom } from '../utils';

import { createGroupTransaction, createTransactionChannels, getTxChannel } from '../transactions';
import { transactionReady, transactionUpdateGas } from '../../actionCreators';
import { ADDRESS_ZERO } from '~constants';

function* finalizeMotion({
  meta,
  payload: { /* userAddress */ colonyAddress, motionId },
}: Action<ActionTypes.MOTION_FINALIZE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const colonyManager = yield getColonyManager();
    const { provider } = colonyManager;
    const colonyClient = yield colonyManager.getClient(ClientType.ColonyClient, colonyAddress);
    const votingReputationClient: AnyVotingReputationClient = yield colonyManager.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );
    const motion = yield votingReputationClient.getMotion(motionId);

    const networkEstimate = yield provider.estimateGas({
      from: votingReputationClient.address,
      to:
        /*
         * If the motion target is 0x000... then we pass in the colony's address
         */
        motion.altTarget === ADDRESS_ZERO ? colonyClient.address : motion.altTarget,
      data: motion.action,
    });
    /*
     * Increase the estimate by 100k WEI. This is a flat increase for all networks
     *
     * @NOTE This will need to be increased further for `setExpenditureState` since
     * that requires even more gas, but since we don't use that one yet, there's
     * no reason to account for it just yet
     */
    const estimate = BigNumber.from(networkEstimate).add(BigNumber.from(100000));

    const { finalizeMotionTransaction } = yield createTransactionChannels(meta.id, ['finalizeMotionTransaction']);

    const batchKey = 'finalizeMotion';

    yield createGroupTransaction(finalizeMotionTransaction, batchKey, meta, {
      context: ClientType.VotingReputationClient,
      methodName: 'finalizeMotion',
      identifier: colonyAddress,
      params: [motionId],
      ready: false,
    });

    yield takeFrom(finalizeMotionTransaction.channel, ActionTypes.TRANSACTION_CREATED);

    yield put(
      transactionUpdateGas(finalizeMotionTransaction.id, {
        gasLimit: estimate.toString(),
      }),
    );

    yield put(transactionReady(finalizeMotionTransaction.id));

    yield takeFrom(finalizeMotionTransaction.channel, ActionTypes.TRANSACTION_SUCCEEDED);

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
