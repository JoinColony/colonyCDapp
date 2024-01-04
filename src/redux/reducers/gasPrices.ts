import { ActionTypes } from '../actionTypes';
import { GasPricesRecord, GasPrices } from '../immutable';
import { ReducerType } from '../types/reducer';

const coreGasPricesReducer: ReducerType<GasPricesRecord> = (
  state = GasPrices(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.GAS_PRICES_UPDATE:
      return GasPrices(action.payload);
    default:
      return state;
  }
};

export default coreGasPricesReducer;
