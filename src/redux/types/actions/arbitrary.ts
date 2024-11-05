import { type ActionTypes } from '~redux/actionTypes.ts';

import { type ActionTypeWithPayload } from './index.ts';

export type ArbitraryActionTypes = ActionTypeWithPayload<
  ActionTypes.CREATE_ARBITRARY_TRANSACTION,
  any
>;
