import { GasPricesRecord } from '../immutable/GasPrices';
import { RootStateRecord } from '../state';
import { CORE_GAS_PRICES } from '../constants';

export const gasPrices = (state: RootStateRecord): GasPricesRecord => state.getIn([CORE_GAS_PRICES]) as GasPricesRecord;
