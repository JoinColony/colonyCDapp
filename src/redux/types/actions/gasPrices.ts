import { GasPricesProps } from '~redux/immutable';

import { ActionTypes } from '../../actionTypes';
import { ActionTypeWithPayload } from '../../types/actions';

export type GasPricesActionTypes = ActionTypeWithPayload<
  ActionTypes.GAS_PRICES_UPDATE,
  GasPricesProps
>;
