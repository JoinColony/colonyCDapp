import { ClientType } from '@colony/colony-js';
import { Interface } from 'ethers/lib/utils';
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
  initiateTransaction,
  putError,
  takeFrom,
  createActionMetadataInDB,
  uploadAnnotation,
} from '../utils/index.ts';

function* arbitraryTxSaga({
  payload: {
    transactions,
    customActionTitle,
    colonyAddress,
    annotationMessage,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.CREATE_ARBITRARY_TRANSACTION>) {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, metaId);

    const contractAddresses: string[] = [];
    const methodsBytes: string[] = [];

    transactions.forEach(({ contractAddress, ...item }) => {
      try {
        const encodedFunction = new Interface(item.jsonAbi).encodeFunctionData(
          item.method,
          item.args?.map((arg) => arg.value),
        );
        contractAddresses.push(contractAddress);
        methodsBytes.push(encodedFunction);
      } catch (e) {
        console.error(e);
      }
    });

    // setup batch ids and channels
    const batchKey = TRANSACTION_METHODS.ArbitraryTxs;

    const { makeArbitraryTransactions, annotateMakeArbitraryTransactions } =
      yield createTransactionChannels(metaId, [
        'makeArbitraryTransactions',
        'annotateMakeArbitraryTransactions',
      ]);

    yield createGroupTransaction({
      channel: makeArbitraryTransactions,
      batchKey,
      meta,
      config: {
        context: ClientType.ColonyClient,
        methodName: 'makeArbitraryTransactions',
        identifier: colonyAddress,
        params: [contractAddresses, methodsBytes, true],
        ready: false,
      },
    });

    if (annotationMessage) {
      yield createGroupTransaction({
        channel: annotateMakeArbitraryTransactions,
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

    yield takeFrom(
      makeArbitraryTransactions.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    if (annotationMessage) {
      yield takeFrom(
        annotateMakeArbitraryTransactions.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction(makeArbitraryTransactions.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(makeArbitraryTransactions.channel);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateMakeArbitraryTransactions,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.CREATE_ARBITRARY_TRANSACTION_SUCCESS,
      meta,
    });
  } catch (caughtError) {
    yield putError(
      ActionTypes.CREATE_ARBITRARY_TRANSACTION_ERROR,
      caughtError,
      meta,
    );
  } finally {
    txChannel.close();
  }
}

export default function* arbitraryTxActionSaga() {
  yield takeEvery(ActionTypes.CREATE_ARBITRARY_TRANSACTION, arbitraryTxSaga);
}
