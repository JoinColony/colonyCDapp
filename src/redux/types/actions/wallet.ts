import { type ActionTypes } from '~redux/actionTypes.ts';

import { type ErrorActionType, type ActionType } from './index.ts';

export type WalletActionTypes =
  | ActionType<ActionTypes.WALLET_OPEN>
  | ActionType<ActionTypes.WALLET_OPEN_SUCCESS>
  | ErrorActionType<ActionTypes.WALLET_OPEN_ERROR, object>
  | ActionType<ActionTypes.USER_CONTEXT_SETUP_SUCCESS>;
