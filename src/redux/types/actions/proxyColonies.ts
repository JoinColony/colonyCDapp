import { type ActionTypes } from '~redux/actionTypes.ts';
import { type Address } from '~types/index.ts';

import { type ErrorActionType, type UniqueActionType } from './index.ts';

export type ProxyColoniesActionTypes =
  | UniqueActionType<
      ActionTypes.PROXY_COLONY_CREATE,
      {
        colonyAddress: Address;
        signerAddress: Address;
        blockNumber: number;
        foreignChainId: number;
      },
      object
    >
  | ErrorActionType<ActionTypes.PROXY_COLONY_CREATE_ERROR, object>
  | UniqueActionType<ActionTypes.PROXY_COLONY_CREATE_SUCCESS, object, object>;
