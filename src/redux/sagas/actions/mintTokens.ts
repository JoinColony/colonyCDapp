import { ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes, type AllActions, type Action } from '~redux/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

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

function* createMintTokensAction({
  payload: {
    colonyAddress,
    nativeTokenAddress,
    amount,
    annotationMessage,
    customActionTitle,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_MINT_TOKENS>) {
  let txChannel;
  try {
    if (!amount) {
      throw new Error('Amount to mint not set for mintTokens transaction');
    }

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = TRANSACTION_METHODS.MintTokens;

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

    yield initiateTransaction(mintTokens.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(mintTokens.channel);

    yield initiateTransaction(claimColonyFunds.id);

    yield waitForTxResult(claimColonyFunds.channel);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateMintTokens,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.ACTION_MINT_TOKENS_SUCCESS,
      meta,
    });
  } catch (caughtError) {
    yield putError(ActionTypes.ACTION_MINT_TOKENS_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* mintTokensActionSaga() {
  yield takeEvery(ActionTypes.ACTION_MINT_TOKENS, createMintTokensAction);
}
