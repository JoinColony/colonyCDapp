import { ClientType } from '@colony/colony-js';
import { type CustomContract } from '@colony/sdk';
import { utils } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { colonyAbi } from '~constants/abis.ts';
import { ContextModule, getContext } from '~context/index.ts';
import { type Action, ActionTypes, type AllActions } from '~redux';
import {
  transactionHashReceived,
  transactionReceiptReceived,
  transactionSent,
  transactionSucceeded,
} from '~redux/actionCreators/transactions.ts';
import { addTransactionToDb } from '~state/transactionState.ts';
import { TransactionStatus } from '~types/graphql.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions/createTransaction.ts';
import {
  createActionMetadataInDB,
  getColonyManager,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';

export type CreateProxyColonyPayload =
  Action<ActionTypes.PROXY_COLONY_CREATE>['payload'];

// @TODO if metatx are enabled sent a metaTx instead of tx
// @TODO we need to add the annotationMessage and the customActionTitle
// @TODO we need to add re-enable logic if the proxy colony was already deployed
function* createProxyColony({
  payload: {
    colonyAddress,
    creationSalt,
    foreignChainId,
    customActionTitle,
    annotationMessage,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.PROXY_COLONY_CREATE>) {
  let txChannel;
  const batchKey = TRANSACTION_METHODS.CreateProxyColony;

  const { annotateCreateProxyColony } = yield createTransactionChannels(
    metaId,
    ['annotateCreateProxyColony'],
  );

  const colonyManager = yield getColonyManager();
  const { address } = getContext(ContextModule.Wallet);

  const walletAddress = utils.getAddress(address);

  try {
    txChannel = yield call(getTxChannel, metaId);

    const proxyColonyContract: CustomContract<typeof colonyAbi> =
      colonyManager.getCustomContract(colonyAddress, colonyAbi);
    const params = [foreignChainId, creationSalt];

    yield addTransactionToDb(metaId, {
      context: ClientType.ColonyClient, // @NOTE we want to add a new context type
      createdAt: new Date(),
      methodName: 'createProxyColony',
      from: walletAddress,
      params,
      status: TransactionStatus.Ready,
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateCreateProxyColony.id, {
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

    const [transaction, waitForMined] = yield proxyColonyContract
      .createTxCreator('createProxyColony', [
        BigInt(foreignChainId),
        creationSalt,
      ])
      .tx()
      .send({
        gasLimit: BigInt(10_000_000),
      });

    yield put(transactionSent(metaId));

    if (!transaction || !transaction.blockHash || !transaction.blockNumber) {
      throw new Error('Invalid transaction'); // @TODO add more info
    }

    yield put(
      transactionHashReceived(metaId, {
        hash: transaction.hash,
        blockNumber: transaction.blockNumber,
        blockHash: transaction.blockHash,
        params,
      }),
    );
    // eslint-disable-next-line no-console
    console.log('PROXY COLONY TXHASH', transaction.hash);

    const [eventData, receipt] = yield waitForMined();

    yield put(transactionReceiptReceived(metaId, { params, receipt }));
    yield put(transactionSucceeded(metaId, { eventData, receipt, params }));

    if (annotationMessage) {
      yield takeFrom(
        annotateCreateProxyColony.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield createActionMetadataInDB(transaction.hash, {
      customTitle: customActionTitle,
    });

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateCreateProxyColony,
        message: annotationMessage,
        txHash: transaction.hash,
      });
    }
    setTxHash?.(transaction.hash);

    yield put<AllActions>({
      type: ActionTypes.PROXY_COLONY_CREATE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    yield putError(ActionTypes.PROXY_COLONY_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* createProxyColonySaga() {
  yield takeEvery(ActionTypes.PROXY_COLONY_CREATE, createProxyColony);
}
