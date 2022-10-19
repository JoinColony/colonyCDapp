import { ActionTypes } from '../../actionTypes';

import { ErrorActionType, ActionType } from './index';

export type WalletActionTypes =
  | ActionType<ActionTypes.WALLET_OPEN>
  | ActionType<ActionTypes.WALLET_OPEN_SUCCESS>
  | ErrorActionType<ActionTypes.WALLET_OPEN_ERROR, object>;
