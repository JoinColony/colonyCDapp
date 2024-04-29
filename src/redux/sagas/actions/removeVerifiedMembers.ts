import { ClientType } from '@colony/colony-js';
import { fork, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux';
import type { Action, AllActions } from '~redux';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { updateContributorVerifiedStatus } from '~utils/members.ts';

import { transactionSetParams } from '../../../state/transactionState.ts';
import {
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  createActionMetadataInDB,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';
import { getRemoveVerifiedMembersOperation } from '../utils/metadataDelta.ts';

function* removeVerifiedMembersAction({
  payload: {
    colonyAddress,
    colonyName,
    members,
    customActionTitle,
    annotationMessage,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_REMOVE_VERIFIED_MEMBERS>) {
  const batchKey = TRANSACTION_METHODS.RemoveVerifiedMembers;

  const { removeVerifiedMembers, annotateRemoveVerifiedMembers } =
    yield createTransactionChannels(metaId, [
      'removeVerifiedMembers',
      'annotateRemoveVerifiedMembers',
    ]);

  try {
    if (!colonyAddress) {
      throw new Error(
        'No colony address set for removeVerifiedMembers transaction',
      );
    }
    if (!Array.isArray(members) || members.length === 0) {
      throw new Error('No members set for removeVerifiedMembers transaction');
    }

    yield fork(createTransaction, removeVerifiedMembers.id, {
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
      yield fork(createTransaction, annotateRemoveVerifiedMembers.id, {
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

    yield takeFrom(
      removeVerifiedMembers.channel,
      ActionTypes.TRANSACTION_CREATED,
    );
    if (annotationMessage) {
      yield takeFrom(
        annotateRemoveVerifiedMembers.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield transactionSetParams(removeVerifiedMembers.id, [
      JSON.stringify(getRemoveVerifiedMembersOperation(members)),
    ]);

    yield initiateTransaction({ id: removeVerifiedMembers.id });

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(removeVerifiedMembers.channel);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateRemoveVerifiedMembers,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.ACTION_REMOVE_VERIFIED_MEMBERS_SUCCESS,
      payload: {},
      meta,
    });

    yield fork(updateContributorVerifiedStatus, members, colonyAddress, false);

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (error) {
    return yield putError(
      ActionTypes.ACTION_REMOVE_VERIFIED_MEMBERS_ERROR,
      error,
      meta,
    );
  } finally {
    [removeVerifiedMembers, annotateRemoveVerifiedMembers].forEach((channel) =>
      channel.channel.close(),
    );
  }
  return null;
}

export default function* removeVerifiedMembersActionSaga() {
  yield takeEvery(
    ActionTypes.ACTION_REMOVE_VERIFIED_MEMBERS,
    removeVerifiedMembersAction,
  );
}
