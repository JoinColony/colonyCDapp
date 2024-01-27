import { ActionTypes } from '~redux/actionTypes.ts';
import { ColonyDecision } from '~types/graphql.ts';
import { Address } from '~types/index.ts';
import { DecisionDraft } from '~utils/decisions.ts';

import {
  ActionTypeWithMeta,
  ActionTypeWithPayload,
  ErrorActionType,
  MetaWithSetter,
  UniqueActionType,
} from './index.ts';

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
