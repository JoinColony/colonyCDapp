import { ActionTypes } from '../../actionTypes';
import { ActionTypeWithPayload } from '../../types/actions';
import { GasPricesProps } from '~redux/immutable';

export type GasPricesActionTypes = ActionTypeWithPayload<ActionTypes.GAS_PRICES_UPDATE, GasPricesProps>;
