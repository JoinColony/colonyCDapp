import { type ActionTypes } from '~redux/actionTypes.ts';

import { type ErrorActionType, type UniqueActionType } from './index.ts';

export type MetacolonyVestingTypes =
  | UniqueActionType<
      ActionTypes.META_CLAIM_ALLOCATION,
      {
        userAddress: string;
        colonyAddress: string;
        grantsTokenAddress: string;
      },
      object
    >
  | ErrorActionType<ActionTypes.META_CLAIM_ALLOCATION_ERROR, object>
  | UniqueActionType<ActionTypes.META_CLAIM_ALLOCATION_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.META_UNWRAP_TOKEN,
      {
        amount: string;
        userAddress: string;
        colonyAddress: string;
        unwrappedTokenAddress: string;
      },
      object
    >
  | ErrorActionType<ActionTypes.META_UNWRAP_TOKEN_ERROR, object>
  | UniqueActionType<ActionTypes.META_UNWRAP_TOKEN_SUCCESS, object, object>;
