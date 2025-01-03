import {
  ClientType,
  type AnyVotingReputationClient,
  Extension,
} from '@colony/colony-js';
import { utils, providers } from 'ethers';
import { call, put, takeEvery } from 'redux-saga/effects';

import { GANACHE_LOCAL_RPC_URL, isDev } from '~constants/index.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type AllActions, type Action } from '~redux/types/actions/index.ts';

import { signMessage } from '../messages/index.ts';
import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import getNetworkClient from '../utils/getNetworkClient.ts';
import { putError, takeFrom, initiateTransaction } from '../utils/index.ts';

export type RevealMotionPayload =
  Action<ActionTypes.MOTION_REVEAL_VOTE>['payload'];

function* revealVoteMotion({
  meta,
  payload: { associatedActionId, userAddress, colonyAddress, motionId },
}: Action<ActionTypes.MOTION_REVEAL_VOTE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    /*
     * We need to set up a non-retry provider when revealing votes
     * This is because we gas estimate both sides, and one will always fail
     * The retry provider is designed to retry the failing estimate or transaction
     * meaning it will never actually catch the error
     */
    const provider = (() => {
      if (isDev) {
        return new providers.StaticJsonRpcProvider(GANACHE_LOCAL_RPC_URL);
      }
      return new providers.Web3Provider(window.ethereum!);
    })();

    const networkClient = yield call(getNetworkClient, provider);

    const colonyClient = yield networkClient.getColonyClient(colonyAddress);

    const votingReputationClient: AnyVotingReputationClient =
      yield colonyClient.getExtensionClient(Extension.VotingReputation);

    const { domainId, rootHash } =
      yield votingReputationClient.getMotion(motionId);

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
    const salt = utils.keccak256(signature);

    /*
     * Infer which side the user voted based on the same salt
     */
    let sideVoted;
    try {
      yield votingReputationClient.estimateGas.revealVote(
        motionId,
        salt,
        0,
        key,
        value,
        branchMask,
        siblings,
        { from: userAddress },
      );
      sideVoted = 0;
    } catch (error) {
      /*
       * We don't want to handle the error here as we are doing this to
       * infer the user's voting choice
       *
       * This is a "cheaper" alternative to looking through events, since
       * this doesn't use so many requests
       */
    }
    try {
      yield votingReputationClient.estimateGas.revealVote(
        motionId,
        salt,
        1,
        key,
        value,
        branchMask,
        siblings,
        { from: userAddress },
      );
      sideVoted = 1;
    } catch (error) {
      // Same as above. Silent error
    }

    if (sideVoted !== undefined) {
      const { revealVoteMotionTransaction } = yield createTransactionChannels(
        meta.id,
        ['revealVoteMotionTransaction'],
      );

      yield createGroupTransaction({
        channel: revealVoteMotionTransaction,
        batchKey: 'revealVoteMotion',
        meta,
        config: {
          associatedActionId,
          context: ClientType.VotingReputationClient,
          methodName: 'revealVote',
          identifier: colonyAddress,
          params: [motionId, salt, sideVoted, key, value, branchMask, siblings],
          ready: false,
        },
      });

      yield takeFrom(
        revealVoteMotionTransaction.channel,
        ActionTypes.TRANSACTION_CREATED,
      );

      yield initiateTransaction(revealVoteMotionTransaction.id);
      yield waitForTxResult(revealVoteMotionTransaction.channel);

      return yield put<AllActions>({
        type: ActionTypes.MOTION_REVEAL_VOTE_SUCCESS,
        meta,
      });
    }
    return yield putError(
      ActionTypes.MOTION_REVEAL_VOTE_ERROR,
      new Error('User did not submit standard vote value'),
      meta,
    );
  } catch (error) {
    return yield putError(ActionTypes.MOTION_REVEAL_VOTE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* revealVoteMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_REVEAL_VOTE, revealVoteMotion);
}
