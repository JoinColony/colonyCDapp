import { Record, Map as ImmutableMap } from 'immutable';

import {
  Connection,
  ConnectionRecord,
  GasPrices,
  GasPricesRecord,
} from '../immutable';

import {
  CORE_CONNECTION,
  CORE_GAS_PRICES,
  CORE_IPFS_DATA,
  CORE_MESSAGES,
  CORE_TRANSACTIONS,
} from '../constants';

import { CoreTransactions, CoreTransactionsRecord } from './transactions';
import { CoreMessages, CoreMessagesRecord } from './messages';
import { IpfsDataType } from './index';

export * from './transactions';
export * from './messages';

type CoreStateProps = {
  [CORE_CONNECTION]: ConnectionRecord;
  [CORE_GAS_PRICES]: GasPricesRecord;
  [CORE_IPFS_DATA]: IpfsDataType;
  [CORE_MESSAGES]: CoreMessagesRecord;
  [CORE_TRANSACTIONS]: CoreTransactionsRecord;
};

export class CoreStateRecord extends Record<CoreStateProps>({
  [CORE_CONNECTION]: Connection(),
  [CORE_GAS_PRICES]: GasPrices(),
  [CORE_IPFS_DATA]: ImmutableMap() as IpfsDataType,
  [CORE_MESSAGES]: CoreMessages(),
  [CORE_TRANSACTIONS]: CoreTransactions(),
}) {}
