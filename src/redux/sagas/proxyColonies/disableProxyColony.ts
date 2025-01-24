import { ClientType } from '@colony/colony-js';
import { fork, put, takeEvery } from 'redux-saga/effects';

import { type Action, ActionTypes, type AllActions } from '~redux';
import { transactionSetParams } from '~state/transactionState.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { takeFrom } from '~utils/saga/effects.ts';

import {
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/createTransaction.ts';
import {
  createActionMetadataInDB,
  initiateTransaction,
  putError,
  uploadAnnotation,
} from '../utils/index.ts';
import { getDisableProxyColonyOperation } from '../utils/metadataDelta.ts';

export type RemoveProxyColonyPayload =
  Action<ActionTypes.PROXY_COLONY_REMOVE>['payload'];

// @TODO if metatx are enabled sent a metaTx instead of tx
function* disableProxyColonyAction({
  payload: {
    colonyAddress,
    foreignChainId,
    customActionTitle,
    annotationMessage,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.PROXY_COLONY_REMOVE>) {
  const batchKey = TRANSACTION_METHODS.RemoveProxyColony;

  const { disableProxyColony, annotateDisableProxyColony } =
    yield createTransactionChannels(metaId, [
      'disableProxyColony',
      'annotateDisableProxyColony',
    ]);

  if (!colonyAddress) {
    throw new Error(
      'No colony address set for disableProxyColonyAction transaction',
    );
  }

  try {
    yield fork(createTransaction, disableProxyColony.id, {
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
      yield fork(createTransaction, annotateDisableProxyColony.id, {
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

    yield takeFrom(disableProxyColony.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateDisableProxyColony.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield transactionSetParams(disableProxyColony.id, [
      JSON.stringify(
        getDisableProxyColonyOperation([foreignChainId.toString()]),
      ),
    ]);

    yield initiateTransaction(disableProxyColony.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(disableProxyColony.channel);

    yield createActionMetadataInDB(txHash, { customTitle: customActionTitle });

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateDisableProxyColony,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.PROXY_COLONY_REMOVE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    yield putError(ActionTypes.PROXY_COLONY_REMOVE_ERROR, error, meta);
  } finally {
    [disableProxyColony, annotateDisableProxyColony].forEach((channel) =>
      channel.channel.close(),
    );
  }
}

export default function* disableProxyColonySaga() {
  yield takeEvery(ActionTypes.PROXY_COLONY_REMOVE, disableProxyColonyAction);
}
