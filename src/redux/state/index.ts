import { Record, Map as ImmutableMap } from 'immutable';

import {
  GasPrices,
  GasPricesRecord,
  FetchableDataRecord,
  FetchableDataType,
} from '../immutable';

import {
  CORE_GAS_PRICES,
  CORE_IPFS_DATA,
  CORE_MESSAGES,
  CORE_TRANSACTIONS,
} from '../constants';

import { CoreTransactions, CoreTransactionsRecord } from './transactions';
import { CoreMessages, CoreMessagesRecord } from './messages';

export type IpfsDataType = ImmutableMap<string, FetchableDataRecord<string>> & {
  toJS(): { [hash: string]: FetchableDataType<string> };
};

type RootStateProps = {
  [CORE_GAS_PRICES]: GasPricesRecord;
  [CORE_IPFS_DATA]: IpfsDataType;
  [CORE_MESSAGES]: CoreMessagesRecord;
  [CORE_TRANSACTIONS]: CoreTransactionsRecord;
};

export class RootStateRecord extends Record<RootStateProps>({
  [CORE_GAS_PRICES]: GasPrices(),
  [CORE_IPFS_DATA]: ImmutableMap() as IpfsDataType,
  [CORE_MESSAGES]: CoreMessages(),
  [CORE_TRANSACTIONS]: CoreTransactions(),
}) {}
