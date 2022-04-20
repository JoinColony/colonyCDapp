import { GasPricesRecord, GasPrices } from '../immutable';
import { ActionTypes } from '../actionTypes';
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
