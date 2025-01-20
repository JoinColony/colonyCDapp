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
import { getEnableProxyColonyOperation } from '../utils/metadataDelta.ts';

export type EnableProxyColonyPayload =
  Action<ActionTypes.PROXY_COLONY_ENABLE>['payload'];

// @TODO if metatx are enabled sent a metaTx instead of tx
function* enableProxyColonyAction({
  payload: {
    colonyAddress,
    foreignChainId,
    customActionTitle,
    annotationMessage,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.PROXY_COLONY_ENABLE>) {
  const batchKey = TRANSACTION_METHODS.CreateProxyColony;

  const { enableProxyColony, annotateEnableProxyColony } =
    yield createTransactionChannels(metaId, [
      'enableProxyColony',
      'annotateEnableProxyColony',
    ]);

  if (!colonyAddress) {
    throw new Error(
      'No colony address set for enableProxyColonyAction transaction',
    );
  }

  try {
    yield fork(createTransaction, enableProxyColony.id, {
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
      yield fork(createTransaction, annotateEnableProxyColony.id, {
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

    yield takeFrom(enableProxyColony.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateEnableProxyColony.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield transactionSetParams(enableProxyColony.id, [
      JSON.stringify(
        getEnableProxyColonyOperation([foreignChainId.toString()]),
      ),
    ]);

    yield initiateTransaction(enableProxyColony.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(enableProxyColony.channel);

    // eslint-disable-next-line no-console
    console.log('PROXY COLONY ENABLE TXHASH', txHash, customActionTitle);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateEnableProxyColony,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.PROXY_COLONY_ENABLE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    yield putError(ActionTypes.PROXY_COLONY_ENABLE_ERROR, error, meta);
  } finally {
    [enableProxyColony, annotateEnableProxyColony].forEach((channel) =>
      channel.channel.close(),
    );
  }
}

export default function* enableProxyColonySaga() {
  yield takeEvery(ActionTypes.PROXY_COLONY_ENABLE, enableProxyColonyAction);
}
