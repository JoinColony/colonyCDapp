import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { ActionTypes, AllActions, Action } from '~redux';
// import { ContextModule, getContext } from '~context';

import {
  putError,
  takeFrom,
  // uploadIfpsAnnotation,
} from '../utils';
import { createTransaction, createTransactionChannels, getTxChannel } from '../transactions';
import {
  transactionReady,
  // transactionPending,
  // transactionAddParams,
} from '../../actionCreators';

function* createMintTokensAction({
  payload: {
    colonyAddress,
    colonyName,
    nativeTokenAddress,
    amount,
    // annotationMessage,
  },
  meta: { id: metaId, navigate },
  meta,
}: Action<ActionTypes.ACTION_MINT_TOKENS>) {
  let txChannel;
  try {
    // const apolloClient = getContext(ContextModule.ApolloClient);

    if (!amount) {
      throw new Error('Amount to mint not set for mintTokens transaction');
    }

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'mintTokens';

    const { mintTokens, claimColonyFunds /* annotateMintTokens */ } = yield createTransactionChannels(metaId, [
      'mintTokens',
      'claimColonyFunds',
      // 'annotateMintTokens',
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

    // if (annotationMessage) {
    //   yield fork(createTransaction, annotateMintTokens.id, {
    //     context: ClientType.ColonyClient,
    //     methodName: 'annotateTransaction',
    //     identifier: colonyAddress,
    //     params: [],
    //     group: {
    //       key: batchKey,
    //       id: metaId,
    //       index: 2,
    //     },
    //     ready: false,
    //   });
    // }

    yield takeFrom(mintTokens.channel, ActionTypes.TRANSACTION_CREATED);
    yield takeFrom(claimColonyFunds.channel, ActionTypes.TRANSACTION_CREATED);
    // if (annotationMessage) {
    //   yield takeFrom(
    //     annotateMintTokens.channel,
    //     ActionTypes.TRANSACTION_CREATED,
    //   );
    // }

    yield put(transactionReady(mintTokens.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(mintTokens.channel, ActionTypes.TRANSACTION_HASH_RECEIVED);
    yield takeFrom(mintTokens.channel, ActionTypes.TRANSACTION_SUCCEEDED);
    yield put(transactionReady(claimColonyFunds.id));
    yield takeFrom(claimColonyFunds.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    // if (annotationMessage) {
    //   yield put(transactionPending(annotateMintTokens.id));

    // const ipfsHash = yield call(uploadIfpsAnnotation, annotationMessage);
    // yield put(
    //   transactionAddParams(annotateMintTokens.id, [txHash, ipfsHash]),
    // );

    //   yield put(transactionReady(annotateMintTokens.id));

    //   yield takeFrom(
    //     annotateMintTokens.channel,
    //     ActionTypes.TRANSACTION_SUCCEEDED,
    //   );
    // }

    yield put<AllActions>({
      type: ActionTypes.ACTION_MINT_TOKENS_SUCCESS,
      meta,
    });

    // Redirect to actions page
    if (colonyName && navigate) {
      yield navigate(`/colony/${colonyName}/tx/${txHash}`);
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
