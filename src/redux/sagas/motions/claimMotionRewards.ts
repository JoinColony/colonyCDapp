import { type ApolloQueryResult } from '@apollo/client';
import { ClientType, getPermissionProofs, ColonyRole } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { all, call, put, takeEvery } from 'redux-saga/effects';

import {
  getContext,
  ContextModule,
  type ColonyManager,
} from '~context/index.ts';
import {
  GetColonyActionDocument,
  type GetColonyActionQuery,
  type GetColonyActionQueryVariables,
} from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type AllActions, type Action } from '~redux/types/actions/index.ts';

import {
  type ChannelDefinition,
  createGroupTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  initiateTransaction,
  putError,
  takeFrom,
  getColonyManager,
} from '../utils/index.ts';

export type ClaimMotionRewardsPayload =
  Action<ActionTypes.MOTION_CLAIM>['payload'];

function* claimMotionRewards({
  meta,
  payload: {
    userAddress,
    colonyAddress,
    extensionAddress,
    transactionHash,
    associatedActionId,
  },
}: Action<ActionTypes.MOTION_CLAIM>) {
  try {
    const apolloClient = getContext(ContextModule.ApolloClient);
    const colonyManager: ColonyManager = yield call(getColonyManager);

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

    const userStakes = motionData.usersStakes.find(
      ({ address }) => address === userAddress,
    );

    if (!userStakes) {
      throw new Error('Could not find stakes for given user address');
    }

    const { stakes } = userStakes ?? {};
    const yayStake = stakes?.raw.yay;
    const nayStake = stakes?.raw.nay;

    const hasYayStake = !BigNumber.from(yayStake).isZero();
    const hasNayStake = !BigNumber.from(nayStake).isZero();

    if (!hasYayStake && !hasNayStake) {
      throw new Error('A motion with claims needs to be provided');
    }

    const YAY_ID = 'yayClaim';
    const NAY_ID = 'nayClaim';

    const channels: { [id: string]: ChannelDefinition } = yield call(
      createTransactionChannels,
      meta.id,
      [...(hasYayStake ? [YAY_ID] : []), ...(hasNayStake ? [NAY_ID] : [])],
    );

    const BATCH_KEY = 'claimMotionRewards';

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      motionData.motionDomain.nativeId,
      ColonyRole.Arbitration,
      extensionAddress,
    );

    yield all(
      Object.keys(channels).map((id) =>
        createGroupTransaction({
          channel: channels[id],
          batchKey: BATCH_KEY,
          meta,
          config: {
            associatedActionId,
            context: ClientType.VotingReputationClient,
            methodName: 'claimReward',
            identifier: colonyAddress,
            params: [
              motionData.motionId,
              permissionDomainId,
              childSkillIndex,
              userAddress,
              id === YAY_ID ? 1 : 0,
            ],
          },
        }),
      ),
    );

    yield all(
      Object.keys(channels).map((id) =>
        takeFrom(channels[id].channel, ActionTypes.TRANSACTION_CREATED),
      ),
    );

    yield all(
      Object.keys(channels).map((id) => initiateTransaction(channels[id].id)),
    );

    yield all(
      Object.keys(channels).map((id) => waitForTxResult(channels[id].channel)),
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
