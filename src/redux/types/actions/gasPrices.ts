import { type GasPricesProps } from '~redux/immutable/index.ts';

import { type ActionTypes } from '../../actionTypes.ts';

import { type ActionTypeWithPayload } from './index.ts';

export type GasPricesActionTypes = ActionTypeWithPayload<
  ActionTypes.GAS_PRICES_UPDATE,
  GasPricesProps
>;
