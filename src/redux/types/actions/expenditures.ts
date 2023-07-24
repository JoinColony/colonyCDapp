import { ActionTypes } from '~redux/actionTypes';
import { Address } from '~types';

import { UniqueActionType, ErrorActionType, MetaWithNavigate } from './index';

export type ExpendituresActionTypes =
  | UniqueActionType<
      ActionTypes.EXPENDITURE_CREATE,
      {
        colonyName: string;
        colonyAddress: Address;
        recipientAddress: Address;
        tokenAddress: Address;
        amount: string;
      },
      MetaWithNavigate<object>
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_CREATE_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_CREATE_SUCCESS, object, object>;
