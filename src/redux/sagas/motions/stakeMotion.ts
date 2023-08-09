import { call, put, takeEvery } from 'redux-saga/effects';
import { AnyVotingReputationClient, ClientType } from '@colony/colony-js';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import {
  putError,
  takeFrom,
  getColonyManager,
  uploadAnnotation,
} from '../utils';

import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { transactionReady } from '../../actionCreators';

function* stakeMotion({
  meta,
  payload: {
    colonyAddress,
    motionId,
    vote,
    amount,
    annotationMessage,
    actionId,
  },
}: Action<ActionTypes.MOTION_STAKE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const colonyManager = yield call(getColonyManager);

    const votingReputationClient: AnyVotingReputationClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const { domainId } = yield call(
      [votingReputationClient, votingReputationClient.getMotion],
      motionId,
    );

    const { approveStake, stakeMotionTransaction, annotateStaking } =
      yield call(createTransactionChannels, meta.id, [
        'approveStake',
        'stakeMotionTransaction',
        'annotateStaking',
      ]);

    const batchKey = 'stakeMotion';

    yield createGroupTransaction(approveStake, batchKey, meta, {
      context: ClientType.ColonyClient,
      methodName: 'approveStake',
      identifier: colonyAddress,
      params: [votingReputationClient.address, domainId, amount],
      ready: false,
    });

    yield createGroupTransaction(stakeMotionTransaction, batchKey, meta, {
      context: ClientType.VotingReputationClient,
      methodName: 'stakeMotionWithProofs',
      identifier: colonyAddress,
      params: [motionId, vote, amount],
      ready: false,
    });

    if (annotationMessage) {
      yield createGroupTransaction(annotateStaking, batchKey, meta, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(approveStake.channel, ActionTypes.TRANSACTION_CREATED);
    yield takeFrom(
      stakeMotionTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    if (annotationMessage) {
      yield takeFrom(annotateStaking.channel, ActionTypes.TRANSACTION_CREATED);
    }

    yield put(transactionReady(approveStake.id));

    yield takeFrom(approveStake.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put(transactionReady(stakeMotionTransaction.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      stakeMotionTransaction.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(
      stakeMotionTransaction.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateStaking,
        message: annotationMessage,
        txHash,
        actionId,
      });
    }

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
