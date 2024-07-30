import { type ActionTypes } from '~redux/actionTypes.ts';
import { type GasPricesProps } from '~redux/immutable/index.ts';

import { type ActionTypeWithPayload } from './index.ts';

export type GasPricesActionTypes = ActionTypeWithPayload<
  ActionTypes.GAS_PRICES_UPDATE,
  GasPricesProps
>;
