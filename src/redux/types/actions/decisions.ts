import { type ColonyRoleFragment } from '~gql';
import { type ActionTypes } from '~redux/actionTypes.ts';
import { type Domain, type ColonyDecision } from '~types/graphql.ts';
import { type Address } from '~types/index.ts';
import { type DecisionDraft } from '~utils/decisions.ts';

import {
  type ActionTypeWithMeta,
  type ActionTypeWithPayload,
  type ErrorActionType,
  type MetaWithSetter,
  type UniqueActionType,
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
        colonyDomains: Domain[];
        colonyRoles: ColonyRoleFragment[];
        isMultiSig?: boolean;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_CREATE_DECISION_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_CREATE_DECISION_SUCCESS,
      MetaWithSetter<object>
    >;
