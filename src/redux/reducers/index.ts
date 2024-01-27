import {
  CORE_GAS_PRICES,
  CORE_MESSAGES,
  CORE_TRANSACTIONS,
  CORE_DECISIONS,
} from '../constants.ts';

import decisionsReducer from './decisions.ts';
import gasPricesReducer from './gasPrices.ts';
import messagesReducer from './messages.ts';
import transactionsReducer from './transactions.ts';

export const coreReducer = {
  [CORE_GAS_PRICES]: gasPricesReducer,
  [CORE_MESSAGES]: messagesReducer,
  [CORE_TRANSACTIONS]: transactionsReducer,
  [CORE_DECISIONS]: decisionsReducer,
};
