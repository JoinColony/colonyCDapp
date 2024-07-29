import {
  ClientType,
  Id,
  type AnyVotingReputationClient,
  getChildIndex,
} from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { call, put, takeEvery } from 'redux-saga/effects';

import { type ColonyManager } from '~context/index.ts';
import { transactionPending } from '~redux/actionCreators/index.ts';
import { transactionSetParams } from '~state/transactionState.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import { ActionTypes } from '../../actionTypes.ts';
import { type AllActions, type Action } from '../../types/actions/index.ts';
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
  initiateTransaction,
} from '../utils/index.ts';

export type EscalateMotionPayload =
  Action<ActionTypes.MOTION_ESCALATE>['payload'];

function* escalateMotion({
  meta,
  payload: { colonyAddress, motionId },
}: Action<ActionTypes.MOTION_ESCALATE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const colonyManager: ColonyManager = yield getColonyManager();

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

    const { escalateMotionTransaction } = yield createTransactionChannels(
      meta.id,
      ['escalateMotionTransaction'],
    );

    const batchKey = TRANSACTION_METHODS.EscalateMotion;

    yield createGroupTransaction({
      channel: escalateMotionTransaction,
      batchKey,
      meta,
      config: {
        context: ClientType.VotingReputationClient,
        methodName: 'escalateMotion',
        identifier: colonyAddress,
        params: [],
        ready: false,
      },
    });

    yield takeFrom(
      escalateMotionTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    yield put(transactionPending(escalateMotionTransaction.id));

    const { domainId, rootHash } = yield call(
      [votingReputationClient, votingReputationClient.getMotion],
      motionId,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      Id.RootDomain,
    );

    const currentUserWalletAddress = yield signer.getAddress();

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      currentUserWalletAddress,
      rootHash,
    );

    const motionDomainChildSkillIdIndex = yield getChildIndex(
      colonyClient.networkClient,
      colonyClient,
      BigNumber.from(Id.RootDomain),
      domainId,
    );

    if (motionDomainChildSkillIdIndex.toNumber() === -1) {
      throw new Error('Child skill index could not be found');
    }

    yield transactionSetParams(escalateMotionTransaction.id, [
      motionId,
      /*
       * We can only escalate the motion in a parent domain, and all current
       * sub-domains have ROOT as the parent domain
       */
      Id.RootDomain,
      motionDomainChildSkillIdIndex,
      key,
      value,
      branchMask,
      siblings,
    ]);

    yield initiateTransaction(escalateMotionTransaction.id);

    yield waitForTxResult(escalateMotionTransaction.channel);

    yield put<AllActions>({
      type: ActionTypes.MOTION_ESCALATE_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.MOTION_ESCALATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* escalateMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_ESCALATE, escalateMotion);
}
