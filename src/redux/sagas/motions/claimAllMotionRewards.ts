import { all, call, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
import { ApolloQueryResult } from '@apollo/client';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { getContext, ContextModule } from '~context';
import { Address, ColonyMotion } from '~types';
import {
  GetColonyMotionDocument,
  GetColonyMotionQuery,
  GetColonyMotionQueryVariables,
} from '~gql';

import {
  ChannelDefinition,
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';

import { putError, takeFrom } from '../utils';

export type ClaimAllMotionRewardsPayload =
  Action<ActionTypes.MOTION_CLAIM_ALL>['payload'];

function* claimAllMotionRewards({
  meta,
  payload: { userAddress, colonyAddress, motionIds: databaseMotionIds },
}: Action<ActionTypes.MOTION_CLAIM_ALL>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const apolloClient = getContext(ContextModule.ApolloClient);

    const motions: ColonyMotion[] = [];

    for (const databaseMotionId of databaseMotionIds) {
      const {
        data: { getColonyMotion },
      }: ApolloQueryResult<GetColonyMotionQuery> = yield apolloClient.query<
        GetColonyMotionQuery,
        GetColonyMotionQueryVariables
      >({
        query: GetColonyMotionDocument,
        variables: {
          id: databaseMotionId,
        },
      });

      if (!getColonyMotion) {
        throw new Error(
          `Motion with database id ${databaseMotionId} does not exist`,
        );
      }

      motions.push(getColonyMotion);
    }

    const [motionsWithYayClaim, motionsWithNayClaim] = getMotionsWithClaims(
      motions,
      userAddress,
    );

    const allMotionClaims = [...motionsWithYayClaim, ...motionsWithNayClaim];

    if (!allMotionClaims.length) {
      throw new Error('A motion with claims needs to be provided');
    }

    const channelNames: string[] = [];

    for (let index = 0; index < allMotionClaims.length; index += 1) {
      channelNames.push(String(index));
    }

    const channels: { [id: string]: ChannelDefinition } = yield call(
      createTransactionChannels,
      meta.id,
      channelNames,
    );

    yield all(
      Object.keys(channels).map((id) =>
        createGroupTransaction(channels[id], 'claimMotionRewards', meta, {
          context: ClientType.VotingReputationClient,
          methodName: 'claimRewardWithProofs',
          identifier: colonyAddress,
          params: [
            allMotionClaims[id],
            userAddress,
            parseInt(id, 10) > motionsWithYayClaim.length - 1 ? 0 : 1,
          ],
        }),
      ),
    );

    yield all(
      Object.keys(channels).map((id) =>
        takeFrom(channels[id].channel, ActionTypes.TRANSACTION_CREATED),
      ),
    );

    yield all(
      Object.keys(channels).map((id) =>
        takeFrom(channels[id].channel, ActionTypes.TRANSACTION_SUCCEEDED),
      ),
    );

    yield put<AllActions>({
      type: ActionTypes.MOTION_CLAIM_ALL_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.MOTION_CLAIM_ALL_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* claimAllMotionRewardsSaga() {
  yield takeEvery(ActionTypes.MOTION_CLAIM_ALL, claimAllMotionRewards);
}

/**
 * Client-side filtering the motions in the db for those
 * with outstanding claims by the given user
 */

function getMotionsWithClaims(motions: ColonyMotion[], userAddress: Address) {
  const motionsWithYayClaims: string[] = [];
  const motionsWithNayClaims: string[] = [];

  motions.forEach((motion) => {
    const { motionId, stakerRewards } = motion;
    const currentUserRewards = stakerRewards.find(
      ({ address }) => address === userAddress,
    );

    if (currentUserRewards) {
      const {
        rewards: { nay, yay },
        isClaimed,
      } = currentUserRewards;

      if (isClaimed) {
        return;
      }

      if (nay !== '0') {
        motionsWithNayClaims.push(motionId);
      }

      if (yay !== '0') {
        motionsWithYayClaims.push(motionId);
      }
    }
  });

  return [motionsWithYayClaims, motionsWithNayClaims];
}
