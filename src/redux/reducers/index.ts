import { combineReducers } from 'redux-immutable';

import transactionsReducer from './transactions';
import gasPricesReducer from './gasPrices';
import ipfsDataReducer from './ipfsData';
import messagesReducer from './messages';
import connectionReducer from './connection';
import walletReducer from './walletReducer';

import {
  CORE_CONNECTION,
  CORE_GAS_PRICES,
  CORE_IPFS_DATA,
  CORE_MESSAGES,
  CORE_TRANSACTIONS,
  USERS_WALLET,
} from '../constants';

export const coreReducer = combineReducers({
  [CORE_CONNECTION]: connectionReducer,
  [CORE_GAS_PRICES]: gasPricesReducer,
  [CORE_IPFS_DATA]: ipfsDataReducer,
  [CORE_MESSAGES]: messagesReducer,
  [CORE_TRANSACTIONS]: transactionsReducer,
});

export const usersReducer = combineReducers({
  [USERS_WALLET]: walletReducer,
});
