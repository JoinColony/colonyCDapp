import { GasPricesProps } from '~redux/immutable/index.ts';

import { ActionTypes } from '../../actionTypes.ts';

import { ActionTypeWithPayload } from './index.ts';

export type GasPricesActionTypes = ActionTypeWithPayload<
  ActionTypes.GAS_PRICES_UPDATE,
  GasPricesProps
>;
