import { ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { apolloClient } from '~apollo';
import { ActionTypes } from '~redux';
import type { Action, AllActions } from '~redux';
import { transactionAddParams } from '~redux/actionCreators/transactions.ts';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  createActionMetadataInDB,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';
import { getAddVerifiedMembersOperation } from '../utils/metadataDelta.ts';

function* addVerifiedMembersAction({
  payload: {
    colonyAddress,
    colonyName,
    members,
    customActionTitle,
    annotationMessage,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_ADD_VERIFIED_MEMBERS>) {
  let txChannel;

  try {
    if (!colonyAddress) {
      throw new Error(
        'No colony address set for addVerifiedMembers transaction',
      );
    }
    if (!Array.isArray(members) || members.length === 0) {
      throw new Error('No members set for addVerifiedMembers transaction');
    }

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'addVerifiedMembers';

    const { addVerifiedMembers, annotateAddVerifiedMembers } =
      yield createTransactionChannels(metaId, [
        'addVerifiedMembers',
        'annotateAddVerifiedMembers',
      ]);

    yield fork(createTransaction, addVerifiedMembers.id, {
      context: ClientType.ColonyClient,
      methodName: 'editColonyByDelta',
      identifier: colonyAddress,
      params: [],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateAddVerifiedMembers.id, {
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

    yield takeFrom(addVerifiedMembers.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateAddVerifiedMembers.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(
      transactionAddParams(addVerifiedMembers.id, [
        JSON.stringify(getAddVerifiedMembersOperation(members)),
      ]),
    );

    yield initiateTransaction({ id: addVerifiedMembers.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      addVerifiedMembers.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    setTxHash?.(txHash);

    waitForTxResult(addVerifiedMembers.channel);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateAddVerifiedMembers,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.ACTION_ADD_VERIFIED_MEMBERS_SUCCESS,
      payload: {},
      meta,
    });

    apolloClient.cache.evict({ fieldName: 'getContributorsByColony' });

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (error) {
    return yield putError(
      ActionTypes.ACTION_ADD_VERIFIED_MEMBERS_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* addVerifiedMembersActionSaga() {
  yield takeEvery(
    ActionTypes.ACTION_ADD_VERIFIED_MEMBERS,
    addVerifiedMembersAction,
  );
}
