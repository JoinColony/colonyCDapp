import { type ActionTypes } from '~redux/actionTypes.ts';
import { type Address } from '~types/index.ts';

import {
  type MetaWithSetter,
  type ErrorActionType,
  type UniqueActionType,
} from './index.ts';

export type ProxyColoniesActionTypes =
  | UniqueActionType<
      ActionTypes.PROXY_COLONY_CREATE,
      {
        colonyAddress: Address;
        foreignChainId: number;
        creationSalt: `0x${string}`;
        annotationMessage?: string;
        customActionTitle: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.PROXY_COLONY_CREATE_ERROR, object>
  | UniqueActionType<ActionTypes.PROXY_COLONY_CREATE_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.PROXY_COLONY_REMOVE,
      {
        colonyAddress: Address;
        foreignChainId: number;
        annotationMessage?: string;
        customActionTitle: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.PROXY_COLONY_REMOVE_ERROR, object>
  | UniqueActionType<ActionTypes.PROXY_COLONY_REMOVE_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.PROXY_COLONY_ENABLE,
      {
        colonyAddress: Address;
        foreignChainId: number;
        annotationMessage?: string;
        customActionTitle: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.PROXY_COLONY_ENABLE_ERROR, object>
  | UniqueActionType<ActionTypes.PROXY_COLONY_ENABLE_SUCCESS, object, object>
  | UniqueActionType<ActionTypes.PROXY_COLONY_ENABLE_SUCCESS, object, object>;
