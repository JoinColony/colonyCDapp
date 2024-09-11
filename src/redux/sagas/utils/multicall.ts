import { ClientType } from '@colony/colony-js';
import { fork } from 'redux-saga/effects';

import { ActionTypes } from '~redux/index.ts';
import { transactionSetParams } from '~state/transactionState.ts';
import { type Address } from '~types';
import { chunkArray } from '~utils/arrays/index.ts';

import {
  type TransactionChannelMap,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';

import { initiateTransaction, takeFrom } from './effects.ts';

interface ChunkedMulticallParams<T> {
  colonyAddress: Address;
  items: T[];
  chunkSize: number;
  metaId: string;
  batchKey: string;
  channelId: string;
  startIndex?: number;
}

/**
 * Helper function to split multicalls into multiple chunks
 * To be used when a single multicall would be too big for a single transaction
 * Returns multiple functions to be called at different points in the saga
 */
export function chunkedMulticall<T>({
  colonyAddress,
  items,
  chunkSize,
  metaId,
  batchKey,
  channelId,
  startIndex = 0,
}: ChunkedMulticallParams<T>) {
  const chunks = chunkArray({ array: items, chunkSize });
  const channelIds = chunks.map((_, index) => `${channelId}-${index}`);
  let channels: TransactionChannelMap = {};

  // Function to create and store channels
  function* createMulticallChannels() {
    channels = yield createTransactionChannels(metaId, channelIds, startIndex);
  }

  // Function to create transactions using the stored channels
  // Intended to be called inside a try catch
  function* createMulticallTransactions() {
    for (let index = 0; index < chunks.length; index += 1) {
      const channel = channels[channelIds[index]];

      yield fork(createTransaction, channel.id, {
        context: ClientType.ColonyClient,
        methodName: 'multicall',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: metaId,
          index: startIndex + index,
        },
        ready: false,
      });
    }
  }

  // Function to process transactions using the stored channels and chunks
  // Intended to be called inside a try catch
  function* processMulticallTransactions({
    encodeFunctionData,
  }: {
    encodeFunctionData: (chunk: T[]) => string[];
  }) {
    for (let index = 0; index < chunks.length; index += 1) {
      const channel = channels[channelIds[index]];
      const multicallData = encodeFunctionData(chunks[index]);

      yield takeFrom(channel.channel, ActionTypes.TRANSACTION_CREATED);

      yield transactionSetParams(channel.id, [multicallData]);
      yield initiateTransaction(channel.id);
      yield waitForTxResult(channel.channel);
    }
  }

  // Function to close all channels
  // Intended to be called in finally
  function closeMulticallChannels() {
    for (const id of channelIds) {
      channels[id].channel.close();
    }
  }

  return {
    createMulticallChannels,
    createMulticallTransactions,
    processMulticallTransactions,
    closeMulticallChannels,
    finalMulticallGroupIndex: startIndex + chunks.length - 1,
  };
}
