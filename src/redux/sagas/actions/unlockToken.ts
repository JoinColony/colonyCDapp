import { call, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux';

import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import {
  createActionMetadataInDB,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils';

function* tokenUnlockAction({
  meta,
  meta: { id: metaId, navigate, setTxHash },
  payload: { colonyAddress, annotationMessage, colonyName, customActionTitle },
}: Action<ActionTypes.ACTION_UNLOCK_TOKEN>) {
  let txChannel;

  try {
    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'tokenUnlockAction';
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
    yield createGroupTransaction(tokenUnlock, batchKey, meta, {
      context: ClientType.ColonyClient,
      methodName: 'unlockToken',
      identifier: colonyAddress,
      params: [],
      ready: false,
    });

    /*
     * If annotation message exists add the transaction to the group
     */
    if (annotationMessage) {
      yield createGroupTransaction(annotateTokenUnlock, batchKey, meta, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
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

    yield initiateTransaction({ id: tokenUnlock.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      tokenUnlock.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    setTxHash?.(txHash);

    yield takeFrom(tokenUnlock.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateTokenUnlock,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.ACTION_UNLOCK_TOKEN_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/colony/${colonyName}/tx/${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (error) {
    putError(ActionTypes.ACTION_UNLOCK_TOKEN_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* unlockTokenActionSaga() {
  yield takeEvery(ActionTypes.ACTION_UNLOCK_TOKEN, tokenUnlockAction);
}
