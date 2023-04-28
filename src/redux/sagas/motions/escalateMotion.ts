import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, Id } from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { putError, takeFrom, getColonyManager } from '../utils';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { transactionReady } from '../../actionCreators';

export type EscalateMotionPayload =
  Action<ActionTypes.MOTION_ESCALATE>['payload'];

function* escalateMotion({
  meta,
  payload: { colonyAddress, motionId },
}: Action<ActionTypes.MOTION_ESCALATE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const context = yield getColonyManager();
    const colonyClient = yield context.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      Id.RootDomain,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      AddressZero,
    );

    const { escalateMotionTransaction } = yield createTransactionChannels(
      meta.id,
      ['escalateMotionTransaction'],
    );

    const batchKey = 'escalateMotion';

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: meta.id,
          index,
        },
      });

    yield createGroupTransaction(escalateMotionTransaction, {
      context: ClientType.VotingReputationClient,
      methodName: 'escalateMotionWithProofs',
      identifier: colonyAddress,
      params: [
        motionId,
        /*
         * We can only escalate the motion in a parent domain, and all current
         * sub-domains have ROOT as the parent domain
         */
        Id.RootDomain,
        key,
        value,
        branchMask,
        siblings,
      ],
      ready: false,
    });

    yield takeFrom(
      escalateMotionTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    yield put(transactionReady(escalateMotionTransaction.id));

    yield takeFrom(
      escalateMotionTransaction.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

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
