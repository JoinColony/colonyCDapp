import { type ApolloQueryResult } from '@apollo/client';
import {
  ClientType,
  getPermissionProofs,
  ColonyRole,
  Id,
} from '@colony/colony-js';
import { all, call, put, takeEvery } from 'redux-saga/effects';

import {
  getContext,
  ContextModule,
  type ColonyManager,
} from '~context/index.ts';
import {
  GetColonyMotionDocument,
  type GetColonyMotionQuery,
  type GetColonyMotionQueryVariables,
} from '~gql';
import { type ColonyMotion } from '~types/graphql.ts';
import { type Address } from '~types/index.ts';

import { ActionTypes } from '../../actionTypes.ts';
import { type AllActions, type Action } from '../../types/actions/index.ts';
import {
  type ChannelDefinition,
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  initiateTransaction,
  putError,
  takeFrom,
  getColonyManager,
} from '../utils/index.ts';

export type ClaimAllMotionRewardsPayload =
  Action<ActionTypes.MOTION_CLAIM_ALL>['payload'];

function* claimAllMotionRewards({
  meta,
  payload: {
    userAddress,
    colonyAddress,
    extensionAddress,
    motionIds: databaseMotionIds,
  },
}: Action<ActionTypes.MOTION_CLAIM_ALL>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const apolloClient = getContext(ContextModule.ApolloClient);
    const colonyManager: ColonyManager = yield call(getColonyManager);

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

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

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
      yield Promise.all(
        Object.keys(channels).map(async (id) => {
          const currentMotion = motions.find(({ motionId }) => motionId === id);

          const [permissionDomainId, childSkillIndex] =
            await getPermissionProofs(
              colonyClient.networkClient,
              colonyClient,
              currentMotion?.motionDomain.nativeId || Id.RootDomain,
              ColonyRole.Arbitration,
              extensionAddress,
            );

          return createGroupTransaction({
            channel: channels[id],
            batchKey: 'claimMotionRewards',
            meta,
            config: {
              context: ClientType.VotingReputationClient,
              methodName: 'claimReward',
              identifier: colonyAddress,
              params: [
                allMotionClaims[id],
                permissionDomainId,
                childSkillIndex,
                userAddress,
                parseInt(id, 10) > motionsWithYayClaim.length - 1 ? 0 : 1,
              ],
            },
          });
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
        initiateTransaction({ id: channels[id].id }),
      ),
    );

    yield all(
      Object.keys(channels).map((id) => waitForTxResult(channels[id].channel)),
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
