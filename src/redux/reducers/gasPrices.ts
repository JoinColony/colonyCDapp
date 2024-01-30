import { ActionTypes } from '../actionTypes.ts';
import { type GasPricesRecord, GasPrices } from '../immutable/index.ts';
import { type ReducerType } from '../types/reducer.ts';

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
