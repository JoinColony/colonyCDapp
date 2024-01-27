import { ActionTypes } from '../../actionTypes.ts';

import { ErrorActionType, ActionType } from './index.ts';

export type WalletActionTypes =
  | ActionType<ActionTypes.WALLET_OPEN>
  | ActionType<ActionTypes.WALLET_OPEN_SUCCESS>
  | ErrorActionType<ActionTypes.WALLET_OPEN_ERROR, object>
  | ActionType<ActionTypes.USER_CONTEXT_SETUP_SUCCESS>;
