import { call, put, takeEvery } from 'redux-saga/effects';
import { AnyVotingReputationClient, ClientType } from '@colony/colony-js';
import { utils } from 'ethers';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { putError, takeFrom, getColonyManager } from '../utils';

import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { transactionReady } from '../../actionCreators';
import { signMessage } from '../messages';

export type MotionVotePayload = Action<ActionTypes.MOTION_VOTE>['payload'];
function* voteMotion({
  meta,
  payload: { userAddress, colonyAddress, motionId, vote },
}: Action<ActionTypes.MOTION_VOTE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const colonyManager = yield getColonyManager();
    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    const votingReputationClient: AnyVotingReputationClient =
      yield colonyManager.getClient(
        ClientType.VotingReputationClient,
        colonyAddress,
      );

    const { domainId, rootHash } = yield votingReputationClient.getMotion(
      motionId,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      domainId,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      userAddress,
      rootHash,
    );

    /*
     * @NOTE We this to be all in one line (no new lines, or line breaks) since
     * Metamask doesn't play nice with them and will replace them, in the message
     * presented to the user with \n
     */
    const message = `Sign this message to generate 'salt' entropy. Extension Address: ${
      votingReputationClient.address
    } Motion ID: ${motionId.toNumber()}`;

    const signature = yield signMessage('motionRevealVote', message);
    const hash = utils.solidityKeccak256(
      ['bytes', 'uint256'],
      [utils.keccak256(signature), vote],
    );

    const { voteMotionTransaction } = yield createTransactionChannels(meta.id, [
      'voteMotionTransaction',
    ]);

    yield createGroupTransaction(voteMotionTransaction, 'voteMotion', meta, {
      context: ClientType.VotingReputationClient,
      methodName: 'submitVote',
      identifier: colonyAddress,
      params: [motionId, hash, key, value, branchMask, siblings],
      ready: false,
    });

    yield takeFrom(
      voteMotionTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    yield put(transactionReady(voteMotionTransaction.id));

    yield takeFrom(
      voteMotionTransaction.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    yield put<AllActions>({
      type: ActionTypes.MOTION_VOTE_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.MOTION_VOTE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* voteMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_VOTE, voteMotion);
}
