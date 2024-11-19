import { ClientType, type ColonyNetworkClient } from '@colony/colony-js';
import { type CustomContract } from '@colony/sdk';
import { utils } from 'ethers';
import { put, takeEvery } from 'redux-saga/effects';

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
  getColonyManager,
  getNetworkClient,
  putError,
} from '../utils/index.ts';

export type CreateProxyColonyPayload =
  Action<ActionTypes.PROXY_COLONY_CREATE>['payload'];

// @TODO if metatx are enabled sent a metaTx instead of tx
function* createProxyColony({
  payload: { colonyAddress, createdAtBlock, foreignChainId },
  meta,
}: Action<ActionTypes.PROXY_COLONY_CREATE>) {
  const batchKey = TRANSACTION_METHODS.CreateProxyColony;

  const colonyManager = yield getColonyManager();
  const networkClient: ColonyNetworkClient = yield getNetworkClient();
  const { address } = getContext(ContextModule.Wallet);

  const walletAddress = utils.getAddress(address);

  try {
    const colonyCreationSalt = yield networkClient.getColonyCreationSalt({
      blockTag: createdAtBlock,
    });

    const proxyColonyContract: CustomContract<typeof colonyAbi> =
      colonyManager.getCustomContract(colonyAddress, colonyAbi);
    const params = [foreignChainId, colonyCreationSalt];

    yield addTransactionToDb(meta.id, {
      context: ClientType.ColonyClient, // @NOTE we want to add a new context type
      createdAt: new Date(),
      methodName: 'createProxyColony',
      from: walletAddress,
      params: [foreignChainId, colonyCreationSalt],
      status: TransactionStatus.Ready,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
    });

    const [transaction, waitForMined] = yield proxyColonyContract
      .createTxCreator('createProxyColony', [
        BigInt(foreignChainId),
        colonyCreationSalt,
      ])
      .tx()
      .send();

    put(transactionSent(meta.id));

    if (!transaction || !transaction.blockHash || !transaction.blockNumber) {
      throw new Error('Invalid transaction'); // @TODO add more info
    }

    put(
      transactionHashReceived(meta.id, {
        hash: transaction.hash,
        blockNumber: transaction.blockNumber,
        blockHash: transaction.blockHash,
        params,
      }),
    );

    const [eventData, receipt] = yield waitForMined();

    put(transactionReceiptReceived(meta.id, { params, receipt }));
    put(transactionSucceeded(meta.id, { eventData, receipt, params }));

    yield put<AllActions>({
      type: ActionTypes.PROXY_COLONY_CREATE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    yield putError(ActionTypes.PROXY_COLONY_CREATE_ERROR, error, meta);
  }
}

export default function* createProxyColonySaga() {
  yield takeEvery(ActionTypes.PROXY_COLONY_CREATE, createProxyColony);
}
