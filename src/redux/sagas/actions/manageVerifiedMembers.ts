import { ClientType } from '@colony/colony-js';
import { fork, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux';
import type { Action, AllActions } from '~redux';
import { transactionSetParams } from '~state/transactionState.ts';
import { ManageVerifiedMembersOperation } from '~types/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { updateContributorVerifiedStatus } from '~utils/members.ts';

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
import {
  getAddVerifiedMembersOperation,
  getRemoveVerifiedMembersOperation,
} from '../utils/metadataDelta.ts';

function* manageVerifiedMembersAction({
  payload: {
    operation,
    colonyAddress,
    members,
    customActionTitle,
    annotationMessage,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_MANAGE_VERIFIED_MEMBERS>) {
  const batchKey =
    operation === ManageVerifiedMembersOperation.Add
      ? TRANSACTION_METHODS.AddVerifiedMembers
      : TRANSACTION_METHODS.RemoveVerifiedMembers;

  const getVerifiedMembersOperation =
    operation === ManageVerifiedMembersOperation.Add
      ? getAddVerifiedMembersOperation
      : getRemoveVerifiedMembersOperation;

  const { manageVerifiedMembers, annotateManageVerifiedMembers } =
    yield createTransactionChannels(metaId, [
      'manageVerifiedMembers',
      'annotateManageVerifiedMembers',
    ]);

  try {
    if (!colonyAddress) {
      throw new Error(
        'No colony address set for manageVerifiedMembersAction transaction',
      );
    }
    if (!Array.isArray(members) || members.length === 0) {
      throw new Error(
        'No members set for manageVerifiedMembersAction transaction',
      );
    }

    yield fork(createTransaction, manageVerifiedMembers.id, {
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
      yield fork(createTransaction, annotateManageVerifiedMembers.id, {
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
      manageVerifiedMembers.channel,
      ActionTypes.TRANSACTION_CREATED,
    );
    if (annotationMessage) {
      yield takeFrom(
        manageVerifiedMembers.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield transactionSetParams(manageVerifiedMembers.id, [
      JSON.stringify(getVerifiedMembersOperation(members)),
    ]);

    yield initiateTransaction(manageVerifiedMembers.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(manageVerifiedMembers.channel);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateManageVerifiedMembers,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.ACTION_MANAGE_VERIFIED_MEMBERS_SUCCESS,
      payload: {},
      meta,
    });

    yield fork(
      updateContributorVerifiedStatus,
      members,
      colonyAddress,
      operation === ManageVerifiedMembersOperation.Add,
    );
  } catch (error) {
    return yield putError(
      ActionTypes.ACTION_MANAGE_VERIFIED_MEMBERS_ERROR,
      error,
      meta,
    );
  } finally {
    [manageVerifiedMembers, annotateManageVerifiedMembers].forEach((channel) =>
      channel.channel.close(),
    );
  }
  return null;
}

export default function* manageVerifiedMembersActionSaga() {
  yield takeEvery(
    ActionTypes.ACTION_MANAGE_VERIFIED_MEMBERS,
    manageVerifiedMembersAction,
  );
}
