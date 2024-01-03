import { ActionTypes } from '~redux/actionTypes';
import { Address, ColonyDecision } from '~types';
import { DecisionDraft } from '~utils/decisions';

import {
  ActionTypeWithMeta,
  ActionTypeWithPayload,
  ErrorActionType,
  MetaWithSetter,
  UniqueActionType,
} from '../actions';

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
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_CREATE_DECISION_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_CREATE_DECISION_SUCCESS,
      MetaWithSetter<object>
    >;
