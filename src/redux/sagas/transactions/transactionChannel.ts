import {
  Provider,
  TransactionReceipt,
  TransactionResponse,
} from '@ethersproject/providers';
import { LogDescription, poll } from 'ethers/lib/utils';
import { buffers, END, eventChannel, Buffer } from 'redux-saga';
import { ContractClient } from '@colony/colony-js';
import { MethodParams, RequireProps } from '~types';
import { TransactionRecord } from '../../immutable';

import {
  transactionSendError,
  transactionEventDataError,
  transactionReceiptError,
  transactionUnsuccessfulError,
  transactionReceiptReceived,
  transactionSent,
  transactionHashReceived,
  transactionSucceeded,
} from '../../actionCreators';

type TransactionResponseWithHash = RequireProps<TransactionResponse, 'hash'>;
// @TODO typing here is not great but I have no idea how to improve it atm
type TxSucceededEvent = {
  eventData: object;
  params: MethodParams;
  receipt: TransactionReceipt;
  deployedContractAddress?: string;
};

const parseEventData = (
  client: ContractClient,
  receipt: TransactionReceipt,
) => {
  let parsedLogs: (LogDescription | null)[] = [];
  if (receipt && receipt.logs) {
    parsedLogs = receipt.logs.map((log) => {
      try {
        return client.interface.parseLog(log);
      } catch {
        /*
         * `parseLog` will throw if the event the log refers to is not among the set of events
         *  contained in the client interface. In this event, we just return null.
         */
        return null;
      }
    });
  }

  return parsedLogs.reduce((events, log) => {
    if (!log) {
      return events;
    }
    // eslint-disable-next-line no-param-reassign
    events[log.name] = log.args;
    return events;
  }, {});
};

const channelSendTransaction = async (
  { id, params }: TransactionRecord,
  txPromise: Promise<TransactionResponse>,
  emit,
) => {
  if (!txPromise) {
    emit(transactionSendError(id, new Error('No send promise found')));
    return null;
  }

  try {
    emit(transactionSent(id));
    const transaction = await txPromise;

    const { hash, blockNumber = 0, blockHash = '' } = transaction;
    if (!hash) {
      emit(transactionSendError(id, new Error('No tx hash found')));
      return null;
    }

    emit(transactionHashReceived(id, { hash, blockNumber, blockHash, params }));

    return transaction as TransactionResponseWithHash;
  } catch (caughtError) {
    console.error(caughtError);
    emit(transactionSendError(id, caughtError));
  }

  return null;
};

const channelGetTransactionReceipt = async (
  { id, params }: TransactionRecord,
  { hash }: TransactionResponseWithHash,
  provider: Provider,
  emit,
) => {
  try {
    // Sometimes the provider does not return a transaction receipt, so we try again
    // (for a really long time)
    const receipt = (await poll(
      async () => {
        const res = await provider.getTransactionReceipt(hash);
        if (!res) return undefined;
        return res;
      },
      { timeout: 60 * 60 * 1000 },
    )) as TransactionReceipt;
    emit(transactionReceiptReceived(id, { receipt, params }));
    return receipt;
  } catch (caughtError) {
    console.error(caughtError);
    emit(transactionReceiptError(id, caughtError));
  }

  return null;
};

const channelGetEventData = async (
  { id, params, metatransaction }: TransactionRecord,
  receipt: TransactionReceipt,
  client: ContractClient,
  emit,
) => {
  try {
    const eventData = parseEventData(client, receipt);
    const txSucceededEvent: TxSucceededEvent = {
      eventData,
      params,
      receipt,
    };
    if (receipt.contractAddress) {
      txSucceededEvent.deployedContractAddress = receipt.contractAddress;
    }
    emit(transactionSucceeded(id, txSucceededEvent, metatransaction));
    return eventData;
  } catch (caughtError) {
    console.error(caughtError);
    emit(transactionEventDataError(id, caughtError));
  }

  return null;
};

const channelStart = async (
  tx: TransactionRecord,
  txPromise: Promise<TransactionResponse>,
  client: ContractClient,
  emit,
) => {
  try {
    const sentTx = await channelSendTransaction(tx, txPromise, emit);
    if (!sentTx) return null;

    const receipt = await channelGetTransactionReceipt(
      tx,
      sentTx,
      client.provider,
      emit,
    );
    if (!receipt) return null;

    if (receipt.status === 1) {
      await channelGetEventData(tx, receipt, client, emit);
    } else {
      /**
       * @todo Use revert reason strings (once supported) in transactions.
       */
      emit(
        transactionUnsuccessfulError(
          tx.id,
          new Error('The transaction was unsuccessful'),
        ),
      );
    }

    return null;
  } catch (caughtError) {
    // This is unlikely to happen, since the functions called have their own
    // error handling, but worth doing for sanity.
    emit(transactionUnsuccessfulError(tx.id, caughtError));
    return null;
  } finally {
    emit(END);
  }
};

/*
 * Given a promise for sending a transaction, send the transaction and
 * emit actions with the transaction status.
 */
const transactionChannel = (
  txPromise: Promise<TransactionResponse>,
  tx: TransactionRecord,
  client: ContractClient,
) =>
  eventChannel((emit) => {
    channelStart(tx, txPromise, client, emit);
    return () => {};
  }, <Buffer<null>>buffers.fixed());

export default transactionChannel;
