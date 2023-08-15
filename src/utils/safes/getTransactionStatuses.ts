import { Contract, ethers, Event } from 'ethers';
import { defineMessages } from 'react-intl';

import { SUPPORTED_SAFE_NETWORKS, isDev } from '~constants';
import {
  getForeignBridgeByChain,
  getHomeBridgeByChain,
} from '~redux/sagas/utils/safeHelpers';
import { isArray } from '~utils/lodash';

import { getApiKey } from './getContractUsefulMethods';

export enum TRANSACTION_STATUS {
  SUCCESS = 'success',
  PENDING = 'pending',
}

const displayName = 'utils.safe';

export const MSG = defineMessages({
  [TRANSACTION_STATUS.SUCCESS]: {
    id: `${displayName}.${[TRANSACTION_STATUS.SUCCESS]}`,
    defaultMessage: 'Completed',
  },
  [TRANSACTION_STATUS.PENDING]: {
    id: `${displayName}.${[TRANSACTION_STATUS.PENDING]}`,
    defaultMessage: 'Action needed',
  },
});

const getMessageLogs = async (
  apiUri: string,
  contract: Contract,
  event: string,
  options: {
    topics: (string | null)[];
  },
  safeChainId: string,
) => {
  // @NOTE: We build a dynamic URL to check with the API if the message exists in the other side (Was executed succesfully)
  const url = new URL(apiUri);
  url.searchParams.append('module', 'logs');
  url.searchParams.append('action', 'getLogs');
  url.searchParams.append('address', contract.address);
  // @NOTE: Since it filters by the message id, only one event will be fetched
  // so there is no need to limit the range of the block to reduce the network traffic
  url.searchParams.append('fromBlock', '0');
  url.searchParams.append('toBlock', 'latest');
  url.searchParams.append('apiKey', getApiKey(Number(safeChainId)) || '');
  // @ts-ignore
  const topics = [contract.interface.events[event].topic, ...options.topics];

  for (let i = 0; i < topics.length; i += 1) {
    if (topics[i] !== null) {
      url.searchParams.append(`topic${i}`, topics[i] as string);
      for (let j = 0; j < i; j += 1) {
        if (topics[j] !== null) {
          url.searchParams.append(`topic${j}_${i}_opr`, 'and');
        }
      }
    }
  }

  const logs = await fetch(url.toString()).then((res) => res.json());

  return logs.result;
};

const checkIfTheMessageWasDelivered = async (
  contract: Contract,
  api: string,
  messageId: string,
  safeChainId: string,
) => {
  const events: Event[] = await getMessageLogs(
    api,
    contract,
    'RelayedMessage',
    {
      topics: [null, null, messageId],
    },
    safeChainId,
  );

  if (isArray(events) && events.length > 0) {
    return true;
  }
  return false;
};

export const getMessageIds = (
  txReceipt: ethers.providers.TransactionReceipt,
  homeAMBContract: Contract,
  bridgeAddress: string,
): string[] => {
  const eventTopic =
    // @ts-ignore
    homeAMBContract.interface.events.UserRequestForSignature.topic;
  const events = txReceipt.logs?.filter(
    (e) => e.address === bridgeAddress && e.topics[0] === eventTopic,
  );

  return (
    events?.map((event) => {
      const {
        // @ts-ignore
        values: { messageId },
      } = homeAMBContract.interface.parseLog(event);
      return messageId || '';
    }) || []
  );
};

export const getTransactionStatuses = async (
  safeChainId: number,
  transactionReceipt: ethers.providers.TransactionReceipt | null,
) => {
  if (!transactionReceipt) {
    return [];
  }

  const networkApiURI =
    SUPPORTED_SAFE_NETWORKS.find((network) => network.chainId === safeChainId)
      ?.apiUri || '';
  const homeAMBContract = getHomeBridgeByChain(safeChainId);
  const foreignAMBContract = getForeignBridgeByChain(safeChainId);

  const messageIds = getMessageIds(
    transactionReceipt,
    homeAMBContract,
    homeAMBContract.address,
  );

  const transactionStatuses = await Promise.all(
    messageIds.map(async (messageId) => {
      const wasTheMessageDelivered = await checkIfTheMessageWasDelivered(
        foreignAMBContract,
        networkApiURI,
        messageId,
        safeChainId.toString(),
      );

      // @NOTE: Safe transactions will always be executed automatically on the local env
      if (wasTheMessageDelivered || isDev) {
        return TRANSACTION_STATUS.SUCCESS;
      }
      return TRANSACTION_STATUS.PENDING;
    }),
  );

  return transactionStatuses;
};
