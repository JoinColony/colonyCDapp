import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { AnyVotingReputationClient, ClientType } from '@colony/colony-js';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { putError, takeFrom, updateMotionValues, getColonyManager } from '../utils';

import { createTransaction, createTransactionChannels, getTxChannel } from '../transactions';
import { transactionReady, transactionPending, transactionAddParams } from '../../actionCreators';
import { ipfsUpload } from '../ipfs';

function* stakeMotion({
  meta,
  payload: { userAddress, colonyAddress, motionId, vote, amount, annotationMessage },
}: Action<ActionTypes.MOTION_STAKE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const colonyManager = yield getColonyManager();
    const colonyClient = yield colonyManager.getClient(ClientType.ColonyClient, colonyAddress);

    const votingReputationClient: AnyVotingReputationClient = yield colonyManager.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const { domainId, rootHash } = yield votingReputationClient.getMotion(motionId);

    const { skillId } = yield call([colonyClient, colonyClient.getDomain], domainId);

    const { key, value, branchMask, siblings } = yield call(colonyClient.getReputation, skillId, userAddress, rootHash);

    const { approveStake, stakeMotionTransaction, annotateStaking } = yield createTransactionChannels(meta.id, [
      'approveStake',
      'stakeMotionTransaction',
      'annotateStaking',
    ]);

    const batchKey = 'stakeMotion';

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: meta.id,
          index,
        },
      });

    yield createGroupTransaction(approveStake, {
      context: ClientType.ColonyClient,
      methodName: 'approveStake',
      identifier: colonyAddress,
      params: [votingReputationClient.address, domainId, amount],
      ready: false,
    });

    yield createGroupTransaction(stakeMotionTransaction, {
      context: ClientType.VotingReputationClient,
      methodName: 'stakeMotionWithProofs',
      identifier: colonyAddress,
      params: [motionId, vote, amount, key, value, branchMask, siblings],
      ready: false,
    });

    if (annotationMessage) {
      yield createGroupTransaction(annotateStaking, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(approveStake.channel, ActionTypes.TRANSACTION_CREATED);
    yield takeFrom(stakeMotionTransaction.channel, ActionTypes.TRANSACTION_CREATED);

    if (annotationMessage) {
      yield takeFrom(annotateStaking.channel, ActionTypes.TRANSACTION_CREATED);
    }

    yield put(transactionReady(approveStake.id));

    yield takeFrom(approveStake.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put(transactionReady(stakeMotionTransaction.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(stakeMotionTransaction.channel, ActionTypes.TRANSACTION_HASH_RECEIVED);

    yield takeFrom(stakeMotionTransaction.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotateStaking.id));

      /*
       * Upload annotation metadata to IPFS
       */
      let annotationMessageIpfsHash = null;
      annotationMessageIpfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          annotationMessage,
        }),
      );

      yield put(transactionAddParams(annotateStaking.id, [txHash, annotationMessageIpfsHash]));

      yield put(transactionReady(annotateStaking.id));

      yield takeFrom(annotateStaking.channel, ActionTypes.TRANSACTION_SUCCEEDED);
    }

    /*
     * Update motion page values
     */
    yield fork(updateMotionValues, colonyAddress, userAddress, motionId);

    yield put<AllActions>({
      type: ActionTypes.MOTION_STAKE_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.MOTION_STAKE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* stakeMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_STAKE, stakeMotion);
}
