import { ActionTypes } from '~redux/actionTypes';
import { ColonyDecision } from '~types';

import { ActionTypeWithPayload } from '../actions';

export type DecisionActionTypes =
  | ActionTypeWithPayload<ActionTypes.DECISION_DRAFT_CREATED, ColonyDecision>
  | ActionTypeWithPayload<ActionTypes.DECISION_DRAFT_REMOVED, string>;
