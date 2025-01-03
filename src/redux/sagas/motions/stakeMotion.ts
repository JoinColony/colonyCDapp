import {
  type AnyVotingReputationClient,
  ClientType,
  getPermissionProofs,
  ColonyRole,
  type TokenLockingClient,
} from '@colony/colony-js';
import { call, put, takeEvery } from 'redux-saga/effects';

import { type ColonyManager } from '~context/index.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type AllActions, type Action } from '~redux/types/actions/index.ts';
import {
  transactionSetParams,
  transactionSetPending,
} from '~state/transactionState.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  putError,
  takeFrom,
  getColonyManager,
  uploadAnnotation,
  initiateTransaction,
} from '../utils/index.ts';

function* stakeMotion({
  meta,
  payload: {
    colonyAddress,
    motionId,
    vote,
    amount,
    annotationMessage,
    actionId,
    tokenAddress,
    activateTokens,
    activeAmount,
    associatedActionId,
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

    const tokenLockingClient: TokenLockingClient =
      yield colonyManager.getClient(
        ClientType.TokenLockingClient,
        colonyAddress,
      );

    const {
      approve,
      deposit,
      approveStake,
      stakeMotionTransaction,
      annotateStaking,
    } = yield call(createTransactionChannels, meta.id, [
      'approve',
      'deposit',
      'approveStake',
      'stakeMotionTransaction',
      'annotateStaking',
    ]);

    const batchKey = TRANSACTION_METHODS.StakeMotion;

    if (activateTokens) {
      const missingActiveTokens = amount.sub(activeAmount);

      yield createGroupTransaction({
        channel: approve,
        batchKey,
        meta,
        config: {
          associatedActionId,
          context: ClientType.TokenClient,
          methodName: 'approve',
          identifier: tokenAddress,
          params: [tokenLockingClient.address, missingActiveTokens],
          ready: false,
        },
      });

      yield createGroupTransaction({
        channel: deposit,
        batchKey,
        meta,
        config: {
          associatedActionId,
          context: ClientType.TokenLockingClient,
          methodName: 'deposit(address,uint256,bool)',
          identifier: colonyAddress,
          params: [tokenAddress, missingActiveTokens, false],
          ready: false,
        },
      });
    }

    yield createGroupTransaction({
      channel: approveStake,
      batchKey,
      meta,
      config: {
        associatedActionId,
        context: ClientType.ColonyClient,
        methodName: 'approveStake',
        identifier: colonyAddress,
        params: [],
        ready: false,
      },
    });

    yield createGroupTransaction({
      channel: stakeMotionTransaction,
      batchKey,
      meta,
      config: {
        associatedActionId,
        context: ClientType.VotingReputationClient,
        methodName: 'stakeMotion',
        identifier: colonyAddress,
        params: [],
        ready: false,
      },
    });

    if (annotationMessage) {
      yield createGroupTransaction({
        channel: annotateStaking,
        batchKey,
        meta,
        config: {
          associatedActionId,
          context: ClientType.ColonyClient,
          methodName: 'annotateTransaction',
          identifier: colonyAddress,
          params: [],
          ready: false,
        },
      });
    }

    if (activateTokens) {
      yield takeFrom(approve.channel, ActionTypes.TRANSACTION_CREATED);

      yield takeFrom(deposit.channel, ActionTypes.TRANSACTION_CREATED);
    }

    yield takeFrom(approveStake.channel, ActionTypes.TRANSACTION_CREATED);
    yield takeFrom(
      stakeMotionTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    if (annotationMessage) {
      yield takeFrom(annotateStaking.channel, ActionTypes.TRANSACTION_CREATED);
    }

    if (activateTokens) {
      yield initiateTransaction(approve.id);

      yield waitForTxResult(approve.channel);

      yield initiateTransaction(deposit.id);

      yield waitForTxResult(deposit.channel);
    }

    yield transactionSetPending(approveStake.id);

    const { domainId, rootHash } = yield call(
      [votingReputationClient, votingReputationClient.getMotion],
      motionId,
    );

    yield transactionSetParams(approveStake.id, [
      votingReputationClient.address,
      domainId,
      amount,
    ]);

    yield initiateTransaction(approveStake.id);

    yield waitForTxResult(approveStake.channel);

    yield transactionSetPending(stakeMotionTransaction.id);

    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
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

    yield transactionSetParams(stakeMotionTransaction.id, [
      motionId,
      permissionDomainId,
      childSkillIndex,
      vote,
      amount,
      key,
      value,
      branchMask,
      siblings,
    ]);

    yield initiateTransaction(stakeMotionTransaction.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(stakeMotionTransaction.channel);

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
