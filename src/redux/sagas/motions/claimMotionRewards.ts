import { all, call, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
import { ApolloQueryResult } from '@apollo/client';
import { BigNumber } from 'ethers';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { getContext, ContextModule } from '~context';
import {
  GetColonyActionDocument,
  GetColonyActionQuery,
  GetColonyActionQueryVariables,
} from '~gql';

import {
  ChannelDefinition,
  createGroupTransaction,
  createTransactionChannels,
} from '../transactions';

import { putError, takeFrom } from '../utils';

export type ClaimMotionRewardsPayload =
  Action<ActionTypes.MOTION_CLAIM>['payload'];

function* claimMotionRewards({
  meta,
  payload: { userAddress, colonyAddress, transactionHash },
}: Action<ActionTypes.MOTION_CLAIM>) {
  const apolloClient = getContext(ContextModule.ApolloClient);
  try {
    const {
      data: { getColonyAction },
    }: ApolloQueryResult<GetColonyActionQuery> = yield apolloClient.query<
      GetColonyActionQuery,
      GetColonyActionQueryVariables
    >({
      query: GetColonyActionDocument,
      variables: {
        transactionHash,
      },
    });

    const motionData = getColonyAction?.motionData;

    if (!motionData) {
      throw new Error('Could not retrieve motion from database');
    }

    const userRewards = motionData.stakerRewards.find(
      ({ address }) => address === userAddress,
    );

    if (!userRewards) {
      throw new Error('Could not find rewards for given user address');
    }

    const {
      rewards: { yay, nay },
    } = userRewards;

    const hasYayClaim = !BigNumber.from(yay).isZero();
    const hasNayClaim = !BigNumber.from(nay).isZero();

    if (!hasYayClaim && !hasNayClaim) {
      throw new Error('A motion with claims needs to be provided');
    }

    const YAY_ID = 'yayClaim';
    const NAY_ID = 'nayClaim';

    const channels: { [id: string]: ChannelDefinition } = yield call(
      createTransactionChannels,
      meta.id,
      [...(hasYayClaim ? [YAY_ID] : []), ...(hasNayClaim ? [NAY_ID] : [])],
    );

    const BATCH_KEY = 'claimMotionRewards';

    yield all(
      Object.keys(channels).map((id) =>
        createGroupTransaction(channels[id], BATCH_KEY, meta, {
          context: ClientType.VotingReputationClient,
          methodName: 'claimRewardWithProofs',
          identifier: colonyAddress,
          params: [motionData.motionId, userAddress, id === YAY_ID ? 1 : 0],
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
  }

  return null;
}

export default function* claimMotionRewardsSaga() {
  yield takeEvery(ActionTypes.MOTION_CLAIM, claimMotionRewards);
}
