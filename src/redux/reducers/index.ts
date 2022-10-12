import transactionsReducer from './transactions';
import gasPricesReducer from './gasPrices';
import ipfsDataReducer from './ipfsData';
import messagesReducer from './messages';
import connectionReducer from './connection';

import {
  CORE_CONNECTION,
  CORE_GAS_PRICES,
  CORE_IPFS_DATA,
  CORE_MESSAGES,
  CORE_TRANSACTIONS,
} from '../constants';

export const coreReducer = {
  [CORE_CONNECTION]: connectionReducer,
  [CORE_GAS_PRICES]: gasPricesReducer,
  [CORE_IPFS_DATA]: ipfsDataReducer,
  [CORE_MESSAGES]: messagesReducer,
  [CORE_TRANSACTIONS]: transactionsReducer,
};
