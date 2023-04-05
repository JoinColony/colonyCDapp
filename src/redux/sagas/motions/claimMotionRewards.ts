import { all, call, put, takeEvery } from 'redux-saga/effects';
import { AnyVotingReputationClient, ClientType } from '@colony/colony-js';
import { ApolloQueryResult } from '@apollo/client';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { getContext, ContextModule, ColonyManager } from '~context';
import { Address, ColonyAction } from '~types';
import {
  GetColonyActionsDocument,
  GetColonyActionsQuery,
  GetColonyActionsQueryVariables,
} from '~gql';
import { notNull } from '~utils/arrays';
import { getMotionDatabaseId } from '~utils/colonyMotions';

import {
  ChannelDefinition,
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';

import { getColonyManager, putError, takeFrom } from '../utils';

export type ClaimAllMotionRewardsPayload =
  Action<ActionTypes.MOTION_CLAIM>['payload'];

function* claimMotionRewards({
  meta,
  payload: { userAddress, colonyAddress, motionIds },
}: Action<ActionTypes.MOTION_CLAIM>) {
  const txChannel = yield call(getTxChannel, meta.id);
  const apolloClient = getContext(ContextModule.ApolloClient);
  try {
    const colonyManager: ColonyManager = yield getColonyManager();
    const { chainId } = yield colonyManager.provider.getNetwork();
    const votingClient: AnyVotingReputationClient =
      yield colonyManager.getClient(
        ClientType.VotingReputationClient,
        colonyAddress,
      );

    const {
      data: { getActionsByColony },
    }: ApolloQueryResult<GetColonyActionsQuery> = yield apolloClient.query<
      GetColonyActionsQuery,
      GetColonyActionsQueryVariables
    >({
      query: GetColonyActionsDocument,
      variables: {
        colonyAddress,
        filter: { isMotion: { eq: true } },
      },
    });

    const motions = getActionsByColony?.items.filter(notNull);

    if (!motions) {
      throw new Error('Could not retrieve motions from database');
    }

    const databaseMotionIds = motionIds.map((nativeMotionId) =>
      getMotionDatabaseId(chainId, votingClient.address, nativeMotionId),
    );

    const [motionsWithYayClaim, motionsWithNayClaim] = getMotionsWithClaims(
      motions,
      databaseMotionIds,
      userAddress,
    );

    const allMotionClaimsCount =
      motionsWithYayClaim.length + motionsWithNayClaim.length;

    if (!allMotionClaimsCount) {
      throw new Error('A motion with claims needs to be provided');
    }

    const channelNames: string[] = [];

    for (let index = 0; index < allMotionClaimsCount; index += 1) {
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
            motionIds[id],
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
      type: ActionTypes.MOTION_CLAIM_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.MOTION_CLAIM_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* claimAllMotionRewardsSaga() {
  yield takeEvery(ActionTypes.MOTION_CLAIM, claimMotionRewards);
}

/**
 * Client-side filtering the motions in the db for those
 * with outstanding claims by the given user
 */

function getMotionsWithClaims(
  motions: ColonyAction[],
  databaseMotionIds: string[],
  userAddress: Address,
) {
  const motionsWithYayClaims: string[] = [];
  const motionsWithNayClaims: string[] = [];

  motions
    /* Filter motions by those ids provided to saga */
    .filter(({ motionData }) =>
      motionData
        ? databaseMotionIds.some(
            (databaseId) => databaseId === motionData.databaseMotionId,
          )
        : false,
    )
    .forEach(({ motionData }) => {
      if (motionData) {
        const { motionId } = motionData;
        const currentUserRewards = motionData.stakerRewards.find(
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
      }
    });

  return [motionsWithYayClaims, motionsWithNayClaims];
}
