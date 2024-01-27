import { Record } from 'immutable';

import {
  CORE_DECISIONS,
  CORE_GAS_PRICES,
  CORE_MESSAGES,
  CORE_TRANSACTIONS,
} from '../constants.ts';
import { GasPrices, GasPricesRecord } from '../immutable/index.ts';

import { CoreDecisions, CoreDecisionsRecord } from './decisions.ts';
import { CoreMessages, CoreMessagesRecord } from './messages.ts';
import { CoreTransactions, CoreTransactionsRecord } from './transactions.ts';

type RootStateProps = {
  [CORE_GAS_PRICES]: GasPricesRecord;
  [CORE_MESSAGES]: CoreMessagesRecord;
  [CORE_TRANSACTIONS]: CoreTransactionsRecord;
  [CORE_DECISIONS]: CoreDecisionsRecord;
};

export class RootStateRecord extends Record<RootStateProps>({
  [CORE_GAS_PRICES]: GasPrices(),
  [CORE_MESSAGES]: CoreMessages(),
  [CORE_TRANSACTIONS]: CoreTransactions(),
  [CORE_DECISIONS]: CoreDecisions(),
}) {}
