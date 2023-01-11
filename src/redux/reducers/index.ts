import transactionsReducer from './transactions';
import gasPricesReducer from './gasPrices';
import messagesReducer from './messages';
import decisionsReducer from './decisions';

import {
  CORE_GAS_PRICES,
  CORE_MESSAGES,
  CORE_TRANSACTIONS,
  CORE_DECISIONS,
} from '../constants';

export const coreReducer = {
  [CORE_GAS_PRICES]: gasPricesReducer,
  [CORE_MESSAGES]: messagesReducer,
  [CORE_TRANSACTIONS]: transactionsReducer,
  [CORE_DECISIONS]: decisionsReducer,
};
