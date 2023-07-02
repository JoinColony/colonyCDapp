import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, Id, getChildIndex } from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';

import { ColonyManager } from '~context';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import {
  transactionAddParams,
  transactionPending,
  transactionReady,
} from '../../actionCreators';

import { putError, takeFrom, getColonyManager } from '../utils';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';

function* createRootMotionSaga({
  payload: {
    operationName,
    colonyAddress,
    colonyName,
    motionParams,
    annotationMessage,
  },
  meta: { id: metaId, navigate },
  meta,
}: Action<ActionTypes.ROOT_MOTION>) {
  let txChannel;
  try {
    if (!motionParams) {
      throw new Error('Parameters not set for rootMotion transaction');
    }

    const colonyManager: ColonyManager = yield getColonyManager();

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const childSkillIndex = yield call(
      getChildIndex,
      colonyClient,
      Id.RootDomain,
      Id.RootDomain,
    );

    const encodedAction = colonyClient.interface.encodeFunctionData(
      operationName,
      motionParams,
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

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'createMotion';

    const { createMotion, annotateRootMotion } =
      yield createTransactionChannels(metaId, [
        'createMotion',
        'annotateRootMotion',
      ]);

    // create transactions
    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        Id.RootDomain,
        childSkillIndex,
        AddressZero,
        encodedAction,
        key,
        value,
        branchMask,
        siblings,
      ],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateRootMotion.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        group: {
          key: batchKey,
          id: metaId,
          index: 1,
        },
        ready: false,
      });
    }

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateRootMotion.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionReady(createMotion.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotateRootMotion.id));
      // @TODO: handle uploading annotation msg to db in saga
      yield put(transactionAddParams(annotateRootMotion.id, [txHash, '']));

      yield put(transactionReady(annotateRootMotion.id));

      yield takeFrom(
        annotateRootMotion.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }
    yield put<AllActions>({
      type: ActionTypes.ROOT_MOTION_SUCCESS,
      meta,
    });

    if (colonyName) {
      navigate(`/colony/${colonyName}/tx/${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (caughtError) {
    putError(ActionTypes.ROOT_MOTION_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* rootMotionSaga() {
  yield takeEvery(ActionTypes.ROOT_MOTION, createRootMotionSaga);
}
