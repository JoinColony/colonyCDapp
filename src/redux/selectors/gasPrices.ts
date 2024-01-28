import { CORE_GAS_PRICES } from '../constants.ts';
import { type GasPricesRecord } from '../immutable/GasPrices.ts';
import { type RootStateRecord } from '../state/index.ts';

export const gasPrices = (state: RootStateRecord): GasPricesRecord =>
  state.getIn([CORE_GAS_PRICES]) as GasPricesRecord;
