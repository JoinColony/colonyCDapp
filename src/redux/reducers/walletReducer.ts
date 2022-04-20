import { WalletRecord, Wallet } from '../immutable';
import { ActionTypes } from '../actionTypes';
import { ReducerType } from '../types/reducer';

const walletReducer: ReducerType<WalletRecord> = (state = Wallet(), action) => {
  switch (action.type) {
    case ActionTypes.WALLET_CREATE_SUCCESS: {
      const { walletType } = action.payload;
      return state.set('walletType', walletType);
    }
    case ActionTypes.USER_CONNECTED: {
      const { isUserConnected } = action.payload;
      return state.set('isUserConnected', isUserConnected);
    }
    case ActionTypes.USER_LOGOUT: {
      return state.set('isUserConnected', false);
    }
    default:
      return state;
  }
};

export default walletReducer;
