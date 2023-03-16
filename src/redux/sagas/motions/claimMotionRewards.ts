import { all, call, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
import { isEmpty } from 'lodash';

import { MotionSide } from '~hooks/motionWidgets/stakingWidget/helpers';
import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';

import {
  ChannelDefinition,
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';

import { putError, takeFrom } from '../utils';

function* claimMotionRewards({
  meta,
  payload: { userAddress, colonyAddress, motionId, claims },
}: Action<ActionTypes.MOTION_CLAIM>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    if (isEmpty(claims)) {
      throw new Error('A motion with claims needs to be provided');
    }

    const channelNames: string[] = [];

    for (let index = 0; index < claims.length; index += 1) {
      channelNames.push(String(index));
    }

    const channels: { [id: string]: ChannelDefinition } = yield call(
      createTransactionChannels,
      meta.id,
      channelNames,
    );

    yield all(
      Object.keys(channels).map((id, idx) =>
        createGroupTransaction(channels[id], 'claimMotionRewards', meta, {
          context: ClientType.VotingReputationClient,
          methodName: 'claimRewardWithProofs',
          identifier: colonyAddress,
          params: [
            motionId,
            userAddress,
            Object.keys(claims[idx])[0] === MotionSide.NAY ? 0 : 1,
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

    // yield all(
    //   [...new Set([...motionWithYAYClaims, ...motionWithNAYClaims])].map(
    //     (motionId) =>
    //       fork(updateMotionValues, colonyAddress, userAddress, motionId),
    //   ),
    // );

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

export default function* claimMotionRewardsSaga() {
  yield takeEvery(ActionTypes.MOTION_CLAIM, claimMotionRewards);
}
