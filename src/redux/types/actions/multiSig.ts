import { type Address } from '~types/index.ts';

import { type ActionTypes } from '../../actionTypes.ts';

import {
  type ErrorActionType,
  type UniqueActionType,
  type UniqueActionTypeWithoutPayload,
} from './index.ts';

export type MultiSigActionTypes =
  | UniqueActionType<
      ActionTypes.MULTISIG_SET_GLOBAL_THRESHOLD,
      {
        colonyAddress: Address;
        threshold: number;
      },
      object
    >
  | ErrorActionType<ActionTypes.MULTISIG_SET_GLOBAL_THRESHOLD_ERROR, object>
  | UniqueActionTypeWithoutPayload<
      ActionTypes.MULTISIG_SET_GLOBAL_THRESHOLD_SUCCESS,
      object
    >;
