import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, getChildIndex, Id } from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { putError, takeFrom, routeRedirect, uploadIfpsAnnotation, getColonyManager } from '../utils';

import { createTransaction, createTransactionChannels, getTxChannel } from '../transactions';
import { transactionReady, transactionPending, transactionAddParams } from '../../actionCreators';

function* moveFundsMotion({
  payload: { colonyAddress, colonyName, version, fromDomainId, toDomainId, amount, tokenAddress, annotationMessage },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.MOTION_MOVE_FUNDS>) {
  let txChannel;
  try {
    /*
     * Validate the required values
     */
    if (!fromDomainId) {
      throw new Error('Source domain not set for oveFundsBetweenPots transaction');
    }
    if (!toDomainId) {
      throw new Error('Recipient domain not set for MoveFundsBetweenPots transaction');
    }
    if (!amount) {
      throw new Error('Payment amount not set for MoveFundsBetweenPots transaction');
    }
    if (!tokenAddress) {
      throw new Error('Payment token not set for MoveFundsBetweenPots transaction');
    }

    const context = yield getColonyManager();
    const colonyClient = yield context.getClient(ClientType.ColonyClient, colonyAddress);

    const [{ fundingPotId: fromPot }, { fundingPotId: toPot }] = yield all([
      call([colonyClient, colonyClient.getDomain], fromDomainId),
      call([colonyClient, colonyClient.getDomain], toDomainId),
    ]);

    const motionChildSkillIndex = yield call(getChildIndex, colonyClient, Id.RootDomain, Id.RootDomain);

    const { skillId } = yield call([colonyClient, colonyClient.getDomain], Id.RootDomain);

    const { key, value, branchMask, siblings } = yield call(colonyClient.getReputation, skillId, AddressZero);

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'createMotion';

    const { createMotion, annotateMoveFundsMotion } = yield createTransactionChannels(metaId, [
      'createMotion',
      'annotateMoveFundsMotion',
    ]);

    const isOldVersion = parseInt(version, 10) <= 6;
    const encodedAction = colonyClient.interface.encodeFunctionData(
      isOldVersion
        ? `moveFundsBetweenPotsWithProofs(uint256,uint256,uint256,address)`
        : 'moveFundsBetweenPotsWithProofs',
      [fromPot, toPot, amount, tokenAddress],
    );

    // create transactions
    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [Id.RootDomain, motionChildSkillIndex, AddressZero, encodedAction, key, value, branchMask, siblings],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateMoveFundsMotion.id, {
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
      yield takeFrom(annotateMoveFundsMotion.channel, ActionTypes.TRANSACTION_CREATED);
    }

    yield put(transactionReady(createMotion.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_HASH_RECEIVED);
    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      const ipfsHash = yield call(uploadIfpsAnnotation, annotationMessage);
      yield put(transactionPending(annotateMoveFundsMotion.id));

      yield put(transactionAddParams(annotateMoveFundsMotion.id, [txHash, ipfsHash]));

      yield put(transactionReady(annotateMoveFundsMotion.id));

      yield takeFrom(annotateMoveFundsMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);
    }
    yield put<AllActions>({
      type: ActionTypes.MOTION_MOVE_FUNDS_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (caughtError) {
    putError(ActionTypes.MOTION_MOVE_FUNDS_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* moveFundsMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_MOVE_FUNDS, moveFundsMotion);
}
