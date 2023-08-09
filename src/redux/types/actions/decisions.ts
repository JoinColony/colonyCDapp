import { ActionTypes } from '~redux/actionTypes';
import { Address, ColonyDecision } from '~types';

import {
  ActionTypeWithMeta,
  ActionTypeWithPayload,
  ErrorActionType,
  MetaWithNavigate,
  UniqueActionType,
} from '../actions';
import { DecisionDraft } from '~utils/decisions';

export type DecisionActionTypes =
  | ActionTypeWithPayload<ActionTypes.DECISION_DRAFT_CREATED, ColonyDecision>
  | ActionTypeWithPayload<
      ActionTypes.DECISION_DRAFT_REMOVED,
      { walletAddress: string; colonyAddress: string }
    >
  | UniqueActionType<
      ActionTypes.MOTION_CREATE_DECISION,
      {
        colonyAddress?: Address;
        colonyName?: string;
        draftDecision: DecisionDraft;
      },
      MetaWithNavigate<object>
    >
  | ErrorActionType<ActionTypes.MOTION_CREATE_DECISION_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_CREATE_DECISION_SUCCESS,
      MetaWithNavigate<object>
    >;
