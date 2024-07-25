import { ClientType } from '@colony/colony-js';
import { call, put, take } from 'redux-saga/effects';

import { TransactionStatus } from '~gql';
import { getTransaction } from '~state/transactionState.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { mergePayload } from '~utils/actions.ts';

import { transactionSendError } from '../../actionCreators/index.ts';
import { type ActionTypes } from '../../actionTypes.ts';
import { type Action } from '../../types/actions/index.ts';
import { getColonyManager } from '../utils/index.ts';

import getMetatransactionPromise from './getMetatransactionPromise.ts';
import getTransactionPromise from './getTransactionPromise.ts';
import transactionChannel from './transactionChannel.ts';

export default function* sendTransaction({
  meta: { id },
}: Action<ActionTypes.TRANSACTION_SEND>) {
  const transaction = yield getTransaction(id, 'cache-first');
  const { status, context, identifier, metatransaction, methodName } =
    transaction;

  if (status !== TransactionStatus.Ready) {
    throw new Error(`Transaction ${id} is not ready to send.`);
  }
  const colonyManager = yield getColonyManager();

  let contextClient: any; // Disregard the `any`. The new ColonyJS messed up all the types
  if (context === ClientType.TokenClient) {
    contextClient = yield colonyManager.getTokenClient(identifier as string);
  } else if (context === ClientType.TokenLockingClient) {
    contextClient = yield colonyManager.getTokenLockingClient(
      identifier as string,
    );
  } else if (
    metatransaction &&
    methodName === TRANSACTION_METHODS.DeployTokenAuthority
  ) {
    contextClient = colonyManager.networkClient;
  } else {
    contextClient = yield colonyManager.getClient(
      context as ClientType,
      identifier,
    );
  }

  if (!contextClient) {
    throw new Error('Context client failed to instantiate');
  }

  const promiseMethod = metatransaction
    ? getMetatransactionPromise
    : getTransactionPromise;

  /*
   * @NOTE Create a promise to send the transaction with the given method.
   *
   * DO NOT! yield this method! Otherwise the error we're throwing inside
   * `getMetatransactionMethodPromise` based on the broadcaster's response message
   * will not catch, so the UI will not properly display it in the Gas Station
   */
  const txPromise = promiseMethod(contextClient, transaction);

  const channel = yield call(
    transactionChannel,
    txPromise,
    transaction,
    contextClient,
  );

  try {
    while (true) {
      const action = yield take(channel);
      // Add the transaction to the payload (we need to get the most recent version of it)
      const currentTransaction = yield getTransaction(id, 'network-only');

      // Put the action to the store
      yield put(mergePayload({ transaction: currentTransaction })(action));
    }
  } catch (error) {
    console.error(error);
    yield put(transactionSendError(id, error));
  } finally {
    channel.close();
  }
}
