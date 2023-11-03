import { call, put, takeEvery } from 'redux-saga/effects';
import {
  AnyVotingReputationClient,
  ClientType,
  getPermissionProofs,
  ColonyRole,
} from '@colony/colony-js';

import { ColonyManager } from '~context';
import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import {
  putError,
  takeFrom,
  getColonyManager,
  uploadAnnotation,
  initiateTransaction,
} from '../utils';

import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { transactionAddParams, transactionPending } from '../../actionCreators';

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
    const colonyManager: ColonyManager = yield call(getColonyManager);

    const { signer } = colonyManager;

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const votingReputationClient: AnyVotingReputationClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.VotingReputationClient,
      colonyAddress,
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
      params: [],
      ready: false,
    });

    yield createGroupTransaction(stakeMotionTransaction, batchKey, meta, {
      context: ClientType.VotingReputationClient,
      methodName: 'stakeMotion',
      identifier: colonyAddress,
      params: [],
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

    yield put(transactionPending(approveStake.id));

    const { domainId, rootHash } = yield call(
      [votingReputationClient, votingReputationClient.getMotion],
      motionId,
    );

    yield put(
      transactionAddParams(approveStake.id, [
        votingReputationClient.address,
        domainId,
        amount,
      ]),
    );

    yield initiateTransaction({ id: approveStake.id });

    yield takeFrom(approveStake.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put(transactionPending(stakeMotionTransaction.id));

    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient,
      domainId,
      ColonyRole.Arbitration,
      votingReputationClient.address,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      domainId,
    );

    const currentUserWalletAddress = yield signer.getAddress();

    const { key, value, branchMask, siblings } =
      yield colonyClient.getReputation(
        skillId,
        currentUserWalletAddress,
        rootHash,
      );

    yield put(
      transactionAddParams(stakeMotionTransaction.id, [
        motionId,
        permissionDomainId,
        childSkillIndex,
        vote,
        amount,
        key,
        value,
        branchMask,
        siblings,
      ]),
    );

    yield initiateTransaction({ id: stakeMotionTransaction.id });

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
