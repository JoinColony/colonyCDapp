import { CORE_GAS_PRICES } from '../constants.ts';
import { GasPricesRecord } from '../immutable/GasPrices.ts';
import { RootStateRecord } from '../state/index.ts';

export const gasPrices = (state: RootStateRecord): GasPricesRecord =>
  state.getIn([CORE_GAS_PRICES]) as GasPricesRecord;
