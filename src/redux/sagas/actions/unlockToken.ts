import { ClientType } from '@colony/colony-js';
import { call, put, takeEvery } from 'redux-saga/effects';

import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  createGroupTransaction,
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

function* tokenUnlockAction({
  meta,
  meta: { id: metaId, setTxHash },
  payload: { colonyAddress, annotationMessage, customActionTitle },
}: Action<ActionTypes.ACTION_UNLOCK_TOKEN>) {
  let txChannel;

  try {
    txChannel = yield call(getTxChannel, metaId);

    const batchKey = TRANSACTION_METHODS.UnlockToken;

    const {
      tokenUnlockAction: tokenUnlock,
      annotateTokenUnlockAction: annotateTokenUnlock,
    } = yield createTransactionChannels(metaId, [
      'tokenUnlockAction',
      'annotateTokenUnlockAction',
    ]);

    /*
     * Add the tokenUnlock transaction to the group
     */
    yield createGroupTransaction({
      channel: tokenUnlock,
      batchKey,
      meta,
      config: {
        context: ClientType.ColonyClient,
        methodName: 'unlockToken',
        identifier: colonyAddress,
        params: [],
        ready: false,
      },
    });

    /*
     * If annotation message exists add the transaction to the group
     */
    if (annotationMessage) {
      yield createGroupTransaction({
        channel: annotateTokenUnlock,
        batchKey,
        meta,
        config: {
          context: ClientType.ColonyClient,
          methodName: 'annotateTransaction',
          identifier: colonyAddress,
          params: [],
          ready: false,
        },
      });
    }

    /*
     * Wait for transactions to be created
     */

    yield takeFrom(tokenUnlock.channel, ActionTypes.TRANSACTION_CREATED);

    if (annotationMessage) {
      yield takeFrom(
        annotateTokenUnlock.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction(tokenUnlock.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(tokenUnlock.channel);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateTokenUnlock,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.ACTION_UNLOCK_TOKEN_SUCCESS,
      meta,
    });
  } catch (error) {
    yield putError(ActionTypes.ACTION_UNLOCK_TOKEN_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* unlockTokenActionSaga() {
  yield takeEvery(ActionTypes.ACTION_UNLOCK_TOKEN, tokenUnlockAction);
}
