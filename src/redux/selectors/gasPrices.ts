import { CORE_GAS_PRICES } from '../constants';
import { GasPricesRecord } from '../immutable/GasPrices';
import { RootStateRecord } from '../state';

export const gasPrices = (state: RootStateRecord): GasPricesRecord =>
  state.getIn([CORE_GAS_PRICES]) as GasPricesRecord;
