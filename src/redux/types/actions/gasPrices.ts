import { ActionTypes } from '../../actionTypes';
import { ActionTypeWithPayload } from '../../types/actions';
import { GasPricesProps } from '~immutable/index';

export type GasPricesActionTypes = ActionTypeWithPayload<
  ActionTypes.GAS_PRICES_UPDATE,
  GasPricesProps
>;
