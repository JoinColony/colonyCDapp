import { ActionTypes } from '~redux/actionTypes';
import { Address } from '~types';

import { UniqueActionType, ErrorActionType } from './index';

export type ExpendituresActionTypes =
  | UniqueActionType<
      ActionTypes.EXPENDITURE_CREATE,
      { colonyAddress: Address },
      object
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_CREATE_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_CREATE_SUCCESS, object, object>;
