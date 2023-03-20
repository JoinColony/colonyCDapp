import { Address } from '~types';

import { ActionTypes } from '../../actionTypes';

import { ErrorActionType, MetaWithHistory, UniqueActionType } from './index';

export type WhitelistActionTypes =
  | UniqueActionType<
      ActionTypes.VERIFIED_RECIPIENTS_MANAGE,
      {
        colonyAddress: Address;
        colonyDisplayName: string;
        colonyAvatarHash: string;
        verifiedAddresses: Address[];
        colonyTokens: Address[];
        annotationMessage?: string;
        colonyName: string;
        isWhitelistActivated: boolean;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.VERIFIED_RECIPIENTS_MANAGE_ERROR, object>
  | UniqueActionType<
      ActionTypes.VERIFIED_RECIPIENTS_MANAGE_SUCCESS,
      object,
      object
    >;
