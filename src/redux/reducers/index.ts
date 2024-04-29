import {
  CORE_GAS_PRICES,
  CORE_MESSAGES,
  CORE_DECISIONS,
} from '../constants.ts';

import decisionsReducer from './decisions.ts';
import gasPricesReducer from './gasPrices.ts';
import messagesReducer from './messages.ts';

export const coreReducer = {
  [CORE_GAS_PRICES]: gasPricesReducer,
  [CORE_MESSAGES]: messagesReducer,
  [CORE_DECISIONS]: decisionsReducer,
};
