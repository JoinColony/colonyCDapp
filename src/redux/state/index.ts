import { Record } from 'immutable';

import { GasPrices, GasPricesRecord } from '../immutable';

import { CORE_GAS_PRICES, CORE_MESSAGES, CORE_TRANSACTIONS } from '../constants';

import { CoreTransactions, CoreTransactionsRecord } from './transactions';
import { CoreMessages, CoreMessagesRecord } from './messages';

type RootStateProps = {
  [CORE_GAS_PRICES]: GasPricesRecord;
  [CORE_MESSAGES]: CoreMessagesRecord;
  [CORE_TRANSACTIONS]: CoreTransactionsRecord;
};

export class RootStateRecord extends Record<RootStateProps>({
  [CORE_GAS_PRICES]: GasPrices(),
  [CORE_MESSAGES]: CoreMessages(),
  [CORE_TRANSACTIONS]: CoreTransactions(),
}) {}
