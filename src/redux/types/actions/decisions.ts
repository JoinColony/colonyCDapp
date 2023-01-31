import { ActionTypes } from '~redux/actionTypes';
import { Decision } from '~types';

import { ActionTypeWithPayload } from '../actions';

export type DecisionActionTypes =
  | ActionTypeWithPayload<ActionTypes.DECISION_DRAFT_CREATED, Decision>
  | ActionTypeWithPayload<ActionTypes.DECISION_DRAFT_REMOVED, string>;
