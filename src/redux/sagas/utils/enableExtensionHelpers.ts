import { fork } from 'redux-saga/effects';
import { BigNumber } from 'ethers';

import { TxConfig } from '~types';
import { ContextModule, getContext, setContext } from '~context';

import { createTransaction, createTransactionChannels } from '~redux/sagas';

export type Channel = Omit<TxConfig, 'methodName'>;

export const removeOldExtensionClients = (colonyAddress: string, extensionId: string) => {
  try {
    const colonyManager = getContext(ContextModule.ColonyManager);
    // Remove old extensions client if exist
    colonyManager.extensionClients.delete(`${colonyAddress}-${extensionId}`);
    setContext(ContextModule.ColonyManager, colonyManager);
  } catch (error) {
    /*
     * Colony manager was not set yet, so there isn't any extension client to remove
     */
  }
};

export const modifyParams = (params, payload) =>
  params.map(({ paramName }) => {
    if (typeof payload[paramName] === 'number') {
      return BigNumber.from(String(payload[paramName]));
    }
    return payload[paramName];
  });

export function* setupEnablingGroupTransactions(
  metaId: string,
  initParams: any[],
  extensionId: string,
  additionalChannels?: {
    [index: string]: Channel | undefined;
  },
) {
  try {
    const channels = {
      initialise: {
        context: `${extensionId}Client`,
        params: initParams,
      },
      ...additionalChannels,
    };

    const transactionChannels = yield createTransactionChannels(metaId, Object.keys(channels));
    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: 'enableExtension',
          id: metaId,
          index,
        },
      });

    return {
      channels,
      transactionChannels,
      createGroupTransaction,
    };
  } catch (error) {
    console.error(error);
    return error;
  }
}
