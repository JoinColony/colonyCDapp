import { ClientType } from '@colony/colony-js';
import { fork, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux';
import type { Action, AllActions } from '~redux';
import { transactionSetParams } from '~state/transactionState.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

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
import { getManageTokensOperation } from '../utils/metadataDelta.ts';
import { validateTokenAddresses } from '../utils/validateTokens.ts';

function* manageTokensAction({
  payload: {
    colonyAddress,
    tokenAddresses,
    customActionTitle,
    annotationMessage,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_MANAGE_TOKENS>) {
  const batchKey = TRANSACTION_METHODS.ManageTokens;

  const { manageTokens, annotateManageTokens } =
    yield createTransactionChannels(metaId, [
      'manageTokens',
      'annotateManageTokens',
    ]);

  try {
    if (!colonyAddress) {
      throw new Error('No colony address set for manageTokens transaction');
    }

    yield fork(createTransaction, manageTokens.id, {
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
      yield fork(createTransaction, annotateManageTokens.id, {
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

    yield takeFrom(manageTokens.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateManageTokens.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield validateTokenAddresses({ tokenAddresses });

    yield transactionSetParams(manageTokens.id, [
      JSON.stringify(getManageTokensOperation(tokenAddresses)),
    ]);

    yield initiateTransaction(manageTokens.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(manageTokens.channel);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateManageTokens,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.ACTION_MANAGE_TOKENS_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.ACTION_MANAGE_TOKENS_ERROR, error, meta);
  } finally {
    [manageTokens, annotateManageTokens].forEach((channel) =>
      channel.channel.close(),
    );
  }
  return null;
}

export default function* manageTokensActionSaga() {
  yield takeEvery(ActionTypes.ACTION_MANAGE_TOKENS, manageTokensAction);
}
