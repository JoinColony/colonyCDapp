import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { ActionTypes, AllActions, Action } from '~redux';

import {
  createActionMetadataInDB,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';

function* createMintTokensAction({
  payload: {
    colonyAddress,
    colonyName,
    nativeTokenAddress,
    amount,
    annotationMessage,
    customActionTitle,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_MINT_TOKENS>) {
  let txChannel;
  try {
    if (!amount) {
      throw new Error('Amount to mint not set for mintTokens transaction');
    }

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'mintTokens';

    const { mintTokens, claimColonyFunds, annotateMintTokens } =
      yield createTransactionChannels(metaId, [
        'mintTokens',
        'claimColonyFunds',
        'annotateMintTokens',
      ]);

    // create transactions
    yield fork(createTransaction, mintTokens.id, {
      context: ClientType.ColonyClient,
      methodName: 'mintTokens',
      identifier: colonyAddress,
      params: [amount],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    yield fork(createTransaction, claimColonyFunds.id, {
      context: ClientType.ColonyClient,
      methodName: 'claimColonyFunds',
      identifier: colonyAddress,
      params: [nativeTokenAddress],
      group: {
        key: batchKey,
        id: metaId,
        index: 1,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateMintTokens.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        group: {
          key: batchKey,
          id: metaId,
          index: 2,
        },
        ready: false,
      });
    }

    yield takeFrom(mintTokens.channel, ActionTypes.TRANSACTION_CREATED);
    yield takeFrom(claimColonyFunds.channel, ActionTypes.TRANSACTION_CREATED);

    if (annotationMessage) {
      yield takeFrom(
        annotateMintTokens.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction({ id: mintTokens.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      mintTokens.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    setTxHash?.(txHash);

    yield takeFrom(mintTokens.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield initiateTransaction({ id: claimColonyFunds.id });

    yield takeFrom(claimColonyFunds.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateMintTokens,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.ACTION_MINT_TOKENS_SUCCESS,
      meta,
    });

    // Redirect to actions page
    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (caughtError) {
    putError(ActionTypes.ACTION_MINT_TOKENS_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* mintTokensActionSaga() {
  yield takeEvery(ActionTypes.ACTION_MINT_TOKENS, createMintTokensAction);
}
